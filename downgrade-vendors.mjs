import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

const env = readFileSync('C:\\Atlas\\projects\\energy-directory\\.env.local', 'utf8')
const ev = {}
env.split('\n').forEach(l => { const [k,...v]=l.split('='); if(k&&v.length) ev[k.trim()]=v.join('=').trim() })
const sb = createClient(ev['NEXT_PUBLIC_SUPABASE_URL'], ev['SUPABASE_SERVICE_ROLE_KEY'])

// Vendors to keep as featured (top 3 per category, resolved across overlaps)
const KEEP_FEATURED = new Set([
  'Baker Hughes Canada Company',
  'Halliburton Canada Ltd.',
  'National Oilwell Varco Canada',
  'Stantec Inc.',
  'Worley',
  'Aecom Canada Ltd.',
  'Canadian Natural Resources Limited',
  'Cenovus Energy',
  'Imperial Oil Ltd.',
  'Schlumberger Canada Limited',
  'Enbridge Inc.',
  'Tc Energy',
  'Pembina Pipeline Corporation',
  'Tetra Tech Canada Inc.',
  'Syncrude Canada Ltd.',
  'Agnico Eagle Mines',
  'Teck Resources Limited',
  'NexGen Energy',
])

// Get all featured vendors
const { data: vendors } = await sb.from('vendors').select('id, company_name, tier').eq('tier', 'featured')

const toDowngrade = vendors.filter(v => !KEEP_FEATURED.has(v.company_name))

console.log(`Featured vendors: ${vendors.length}`)
console.log(`Keeping featured: ${vendors.length - toDowngrade.length}`)
console.log(`Downgrading to free: ${toDowngrade.length}\n`)
toDowngrade.forEach(v => console.log(` - ${v.company_name}`))

// Execute downgrade + clear logos
const ids = toDowngrade.map(v => v.id)
const { error } = await sb.from('vendors')
  .update({ tier: 'free', logo_url: null })
  .in('id', ids)

if (error) {
  console.log('\n❌ Error:', error.message)
} else {
  console.log(`\n✅ Done — ${toDowngrade.length} vendors downgraded to free, logos cleared.`)
}
