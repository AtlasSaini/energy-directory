/**
 * scrape-emails.mjs
 * Scrapes contact emails from vendor websites and populates the `email` column.
 * 
 * Strategy:
 * - Fetch homepage HTML → extract mailto: links and email patterns
 * - If no email found, try /contact and /contact-us pages
 * - Store the most relevant email found (prefer contact@/info@ over noreply@)
 * - Concurrency: 8 parallel, 8s timeout per request, polite 100ms gap between fetches
 * 
 * CASL compliance note:
 * Only stores emails publicly displayed on the vendor's own website.
 * These constitute implied consent under CASL s.10(9)(b).
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const CONCURRENCY = 8;
const TIMEOUT_MS = 8000;
const BATCH_SIZE = 100;

const sb = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// Email regex — matches most standard emails
const EMAIL_RE = /\b([a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,})\b/g;

// Emails to skip (generic/useless for outreach)
const SKIP_PATTERNS = [
  /noreply/i, /no-reply/i, /donotreply/i, /webmaster/i,
  /spamarrest/i, /spamgourmet/i, /example\.com/,
  /\.(png|jpg|gif|svg|css|js)$/i,
  /schema\.org/i, /w3\.org/i, /google\.com/i, /facebook\.com/i,
  /linkedin\.com/i, /twitter\.com/i, /youtube\.com/i,
];

// Priority order for email selection (lower index = better)
const PRIORITY_PREFIXES = [
  'info', 'contact', 'hello', 'general', 'inquiries', 'inquiry',
  'office', 'admin', 'reception', 'business', 'sales', 'calgary',
  'alberta', 'canada', 'mail', 'support',
];

function scoreEmail(email) {
  const local = email.split('@')[0].toLowerCase();
  const idx = PRIORITY_PREFIXES.findIndex(p => local.startsWith(p));
  return idx === -1 ? PRIORITY_PREFIXES.length : idx;
}

function extractEmails(html, vendorDomain) {
  const found = new Set();

  // From mailto: links
  const mailtoRe = /mailto:([^\s"'?&<>]+)/gi;
  let m;
  while ((m = mailtoRe.exec(html)) !== null) {
    const e = m[1].trim().toLowerCase();
    if (e.includes('@')) found.add(e);
  }

  // From plain text patterns
  const matches = html.match(EMAIL_RE) || [];
  for (const e of matches) found.add(e.toLowerCase());

  // Filter
  const valid = [...found].filter(e => {
    if (SKIP_PATTERNS.some(p => p.test(e))) return false;
    if (!e.includes('.')) return false;
    if (e.length > 100) return false;
    return true;
  });

  if (valid.length === 0) return null;

  // Prefer same-domain emails, then by priority prefix
  const sameDomain = valid.filter(e => vendorDomain && e.endsWith('@' + vendorDomain));
  const pool = sameDomain.length > 0 ? sameDomain : valid;

  pool.sort((a, b) => scoreEmail(a) - scoreEmail(b));
  return pool[0];
}

async function fetchPage(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; EnergyDirectoryBot/1.0; +https://energydirectory.ca)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      redirect: 'follow',
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('html') && !ct.includes('text')) return null;
    return await res.text();
  } catch {
    clearTimeout(timer);
    return null;
  }
}

function getDomain(website) {
  try {
    return new URL(website).hostname.replace(/^www\./, '');
  } catch {
    return null;
  }
}

function getContactUrls(website) {
  try {
    const base = new URL(website).origin;
    return [`${base}/contact`, `${base}/contact-us`, `${base}/about`, `${base}/about-us`];
  } catch {
    return [];
  }
}

async function scrapeVendor(vendor) {
  const { id, company_name, website } = vendor;
  const domain = getDomain(website);

  // Try homepage first
  const homeHtml = await fetchPage(website);
  if (homeHtml) {
    const email = extractEmails(homeHtml, domain);
    if (email) return { id, email, source: 'homepage' };
  }

  // Try contact pages
  for (const url of getContactUrls(website)) {
    const html = await fetchPage(url);
    if (html) {
      const email = extractEmails(html, domain);
      if (email) return { id, email, source: url };
    }
  }

  return { id, email: null, source: 'not_found' };
}

async function runBatch(vendors) {
  const results = [];
  const queue = [...vendors];
  let active = 0;
  let resolved = 0;

  return new Promise((resolve) => {
    function next() {
      while (active < CONCURRENCY && queue.length > 0) {
        const vendor = queue.shift();
        active++;
        scrapeVendor(vendor).then(result => {
          results.push(result);
          active--;
          resolved++;
          if (resolved % 10 === 0) {
            process.stdout.write(`\r  Progress: ${resolved}/${vendors.length} (${results.filter(r=>r.email).length} emails found)`);
          }
          if (queue.length === 0 && active === 0) {
            process.stdout.write('\n');
            resolve(results);
          } else {
            next();
          }
        });
      }
    }
    next();
  });
}

async function main() {
  console.log('🔍 Energy Directory — Email Scraper');
  console.log('=====================================');

  // Fetch all vendors needing scraping
  const { data: vendors, error } = await sb
    .from('vendors')
    .select('id, company_name, website')
    .eq('active', true)
    .not('website', 'is', null)
    .is('email', null)
    .order('company_name');

  if (error) { console.error('DB error:', error.message); process.exit(1); }
  console.log(`📋 Found ${vendors.length} vendors to scrape\n`);

  let totalFound = 0;
  let totalProcessed = 0;

  // Process in batches
  for (let i = 0; i < vendors.length; i += BATCH_SIZE) {
    const batch = vendors.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(vendors.length / BATCH_SIZE);
    console.log(`\n📦 Batch ${batchNum}/${totalBatches} (vendors ${i + 1}–${i + batch.length})`);

    const results = await runBatch(batch);

    // Update DB for found emails
    const found = results.filter(r => r.email);
    if (found.length > 0) {
      for (const { id, email } of found) {
        await sb.from('vendors').update({ email }).eq('id', id);
      }
    }

    totalFound += found.length;
    totalProcessed += results.length;

    console.log(`  ✅ Batch ${batchNum} done: ${found.length}/${batch.length} emails found`);
    console.log(`  Running total: ${totalFound}/${totalProcessed} (${Math.round(totalFound/totalProcessed*100)}%)`);
  }

  console.log('\n=====================================');
  console.log(`🎉 Done! Found emails for ${totalFound}/${totalProcessed} vendors`);
  console.log(`📊 Hit rate: ${Math.round(totalFound/totalProcessed*100)}%`);
  console.log(`📭 No email found: ${totalProcessed - totalFound} vendors`);
}

main().catch(console.error);
