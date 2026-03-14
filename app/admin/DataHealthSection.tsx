/**
 * DataHealthSection.tsx
 * Data Health section for the admin dashboard.
 * Shows vendor health status based on automated website/registry checks.
 *
 * Requires columns: data_status, health_flag, last_verified_at
 * Run migration: /mnt/c/Atlas/scripts/migrate-vendor-health-columns.sql
 */

import { createAdminClient } from '@/lib/supabase'

// ─── Types ────────────────────────────────────────────────────────────────────

interface HealthVendor {
  id: string
  company_name: string | null
  website: string | null
  data_status: string | null
  health_flag: string | null
  last_verified_at: string | null
  active: boolean
}

// ─── Flag display helpers ─────────────────────────────────────────────────────

const FLAG_LABELS: Record<string, { label: string; color: string }> = {
  dead_link:          { label: 'Dead link (404)',     color: 'text-red-600'    },
  domain_gone:        { label: 'Domain gone/expired', color: 'text-red-700'    },
  domain_parked:      { label: 'Domain parked/sale',  color: 'text-orange-600' },
  domain_redirected:  { label: 'Domain redirected',   color: 'text-amber-600'  },
  timeout:            { label: 'Timeout',              color: 'text-gray-500'   },
  http_error:         { label: 'HTTP error',           color: 'text-amber-700'  },
  news_bankruptcy:    { label: 'Bankruptcy news',      color: 'text-red-800'    },
  registry_dissolved: { label: 'Registry dissolved',   color: 'text-red-900'    },
}

function getFlagDisplay(flag: string | null) {
  if (!flag) return { label: 'Unknown', color: 'text-gray-400' }
  return FLAG_LABELS[flag] || { label: flag, color: 'text-gray-600' }
}

function fmtDate(isoStr: string | null) {
  if (!isoStr) return 'Never'
  return new Date(isoStr).toLocaleDateString('en-CA', {
    year: 'numeric', month: 'short', day: 'numeric',
    timeZone: 'America/Edmonton',
  })
}

// ─── Data fetching ────────────────────────────────────────────────────────────

async function fetchHealthData() {
  const supabase = createAdminClient()

  // Check if data_status column exists by trying to query it
  // If it doesn't exist yet, return a migration-needed state
  try {
    const { data: staleData, error: staleError } = await supabase
      .from('vendors')
      .select('id, company_name, website, data_status, health_flag, last_verified_at, active')
      .eq('data_status', 'stale')
      .eq('active', true)
      .order('company_name')
      .limit(200)

    if (staleError) {
      // Column likely doesn't exist yet
      return { migrationNeeded: true, stale: [], review: [], lastCheckDate: null, flagCounts: {} }
    }

    const { data: reviewData } = await supabase
      .from('vendors')
      .select('id, company_name, website, data_status, health_flag, last_verified_at, active')
      .eq('data_status', 'review_needed')
      .order('company_name')
      .limit(100)

    // Get the most recent last_verified_at across all vendors
    const { data: recentCheck } = await supabase
      .from('vendors')
      .select('last_verified_at')
      .not('last_verified_at', 'is', null)
      .order('last_verified_at', { ascending: false })
      .limit(1)

    // Flag breakdown
    const { data: flagData } = await supabase
      .from('vendors')
      .select('health_flag')
      .not('health_flag', 'is', null)
      .eq('active', true)

    const flagCounts: Record<string, number> = {}
    ;(flagData || []).forEach((v: { health_flag: string | null }) => {
      if (v.health_flag) {
        flagCounts[v.health_flag] = (flagCounts[v.health_flag] || 0) + 1
      }
    })

    return {
      migrationNeeded: false,
      stale: (staleData || []) as HealthVendor[],
      review: (reviewData || []) as HealthVendor[],
      lastCheckDate: recentCheck?.[0]?.last_verified_at ?? null,
      flagCounts,
    }
  } catch {
    return { migrationNeeded: true, stale: [], review: [], lastCheckDate: null, flagCounts: {} }
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default async function DataHealthSection() {
  const { migrationNeeded, stale, review, lastCheckDate, flagCounts } = await fetchHealthData()

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-base font-semibold text-[#0a1628]">Data Health</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Automated website & registry check results
            {lastCheckDate && (
              <> · Last check: <span className="font-medium">{fmtDate(lastCheckDate)}</span></>
            )}
          </p>
        </div>
        <a
          href="#how-to-run"
          className="text-xs bg-blue-50 border border-blue-200 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
        >
          🔄 How to Run Health Check
        </a>
      </div>

      {/* Migration notice */}
      {migrationNeeded && (
        <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
          <div className="flex items-start gap-3">
            <span className="text-amber-500 text-lg">⚠️</span>
            <div>
              <p className="text-sm font-medium text-amber-800">Database migration needed</p>
              <p className="text-xs text-amber-700 mt-1">
                Run the migration to enable vendor health tracking:
              </p>
              <code className="block mt-2 text-xs bg-amber-100 text-amber-900 px-3 py-2 rounded font-mono">
                /mnt/c/Atlas/scripts/migrate-vendor-health-columns.sql
              </code>
              <p className="text-xs text-amber-600 mt-1">
                Paste into: Supabase Dashboard → SQL Editor
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stats row */}
      {!migrationNeeded && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <HealthCard
            label="Stale Listings"
            value={stale.length}
            desc="Website issues detected"
            color="amber"
          />
          <HealthCard
            label="Pending Review"
            value={review.length}
            desc="Bankruptcy/news signals"
            color="red"
          />
          <HealthCard
            label="Last Check"
            value={lastCheckDate ? fmtDate(lastCheckDate) : '—'}
            desc="Most recent verification"
            color="blue"
            isText
          />
          <HealthCard
            label="Flag Types"
            value={Object.keys(flagCounts).length}
            desc="Distinct issue categories"
            color="gray"
          />
        </div>
      )}

      {/* Flag breakdown */}
      {!migrationNeeded && Object.keys(flagCounts).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">Issue Breakdown</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(flagCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([flag, count]) => {
                const display = getFlagDisplay(flag)
                return (
                  <span
                    key={flag}
                    className="inline-flex items-center gap-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1"
                  >
                    <span className={`font-medium ${display.color}`}>{display.label}</span>
                    <span className="text-gray-400">·</span>
                    <span className="font-bold text-gray-700">{count}</span>
                  </span>
                )
              })}
          </div>
        </div>
      )}

      {/* Stale vendors list */}
      {!migrationNeeded && stale.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Stale Vendors ({stale.length})
            <span className="text-xs font-normal text-gray-400 ml-2">website issues</span>
          </h3>
          <div className="rounded-lg border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2 hidden md:table-cell">Website</th>
                  <th className="px-4 py-2">Issue</th>
                  <th className="px-4 py-2 hidden sm:table-cell">Last OK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {stale.slice(0, 50).map(v => {
                  const flagDisplay = getFlagDisplay(v.health_flag)
                  return (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2.5 font-medium text-gray-800 text-xs">
                        {v.company_name || '—'}
                      </td>
                      <td className="px-4 py-2.5 hidden md:table-cell">
                        {v.website ? (
                          <a
                            href={v.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline truncate max-w-[200px] block"
                          >
                            {v.website.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                          </a>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-xs font-medium ${flagDisplay.color}`}>
                          {flagDisplay.label}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 hidden sm:table-cell text-xs text-gray-500">
                        {fmtDate(v.last_verified_at)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {stale.length > 50 && (
              <div className="px-4 py-2 text-xs text-gray-400 bg-gray-50 border-t border-gray-100">
                Showing 50 of {stale.length} stale vendors
              </div>
            )}
          </div>
        </div>
      )}

      {/* Review needed list */}
      {!migrationNeeded && review.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-red-700 mb-2">
            ⚠️ Pending Review ({review.length})
            <span className="text-xs font-normal text-gray-400 ml-2">bankruptcy/receivership signals</span>
          </h3>
          <div className="rounded-lg border border-red-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-red-50">
                <tr className="text-left text-xs text-red-500 uppercase tracking-wide">
                  <th className="px-4 py-2">Company</th>
                  <th className="px-4 py-2">Flag</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-red-50">
                {review.map(v => (
                  <tr key={v.id} className="hover:bg-red-50/50">
                    <td className="px-4 py-2.5 font-medium text-gray-800 text-xs">
                      {v.company_name || '—'}
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="text-xs font-medium text-red-700">
                        {getFlagDisplay(v.health_flag).label}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500">
                      Verify & confirm status
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!migrationNeeded && stale.length === 0 && review.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <div className="text-3xl mb-2">✅</div>
          <p className="text-sm font-medium">All clear</p>
          <p className="text-xs mt-1">No stale vendors or review flags</p>
        </div>
      )}

      {/* How to run manually */}
      <div id="how-to-run" className="rounded-lg bg-gray-50 border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-2">🔄 Run Health Check Manually</h3>
        <p className="text-xs text-gray-500 mb-3">
          Health checks run automatically via cron. To trigger manually from the Atlas machine:
        </p>
        <div className="space-y-2">
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Website check (dry run first):</p>
            <code className="block text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded font-mono">
              node /mnt/c/Atlas/scripts/check-vendor-websites.js --dry-run
            </code>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Website check (live):</p>
            <code className="block text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded font-mono">
              node /mnt/c/Atlas/scripts/check-vendor-websites.js
            </code>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Corporate registry check (dry run):</p>
            <code className="block text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded font-mono">
              node /mnt/c/Atlas/scripts/check-corporate-registry.js --dry-run
            </code>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-600 mb-1">Generate health report:</p>
            <code className="block text-xs bg-gray-100 text-gray-800 px-3 py-1.5 rounded font-mono">
              node /mnt/c/Atlas/scripts/vendor-health-report.js
            </code>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-3">
          Logs: <code className="font-mono">/mnt/c/Atlas/logs/</code> · Reports: <code className="font-mono">/mnt/c/Atlas/reports/</code>
        </p>
      </div>
    </div>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function HealthCard({
  label,
  value,
  desc,
  color,
  isText = false,
}: {
  label: string
  value: number | string
  desc: string
  color: 'amber' | 'red' | 'blue' | 'green' | 'gray'
  isText?: boolean
}) {
  const colors = {
    amber: 'bg-amber-50 border-amber-200 text-amber-700',
    red:   'bg-red-50   border-red-200   text-red-700',
    blue:  'bg-blue-50  border-blue-200  text-blue-700',
    green: 'bg-green-50 border-green-200 text-green-700',
    gray:  'bg-gray-50  border-gray-200  text-gray-700',
  }
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <div className={`font-extrabold ${isText ? 'text-sm' : 'text-2xl'}`}>
        {typeof value === 'number' ? value.toLocaleString() : value}
      </div>
      <div className="text-xs font-medium mt-1">{label}</div>
      <div className="text-xs mt-0.5 opacity-70">{desc}</div>
    </div>
  )
}
