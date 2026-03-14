'use client'

import { useState, useTransition } from 'react'
import { setVendorInactive, setVendorDisplayPartial, hideAllBareVendors } from './actions'

interface BareVendor {
  id: string
  company_name: string
  province: string | null
  categories: string[]
  user_id: string | null
  active: boolean
}

const PAGE_SIZE = 50

export default function BareVendorsTable({ vendors }: { vendors: BareVendor[] }) {
  const [page, setPage] = useState(0)
  const [localVendors, setLocalVendors] = useState(vendors)
  const [isPending, startTransition] = useTransition()
  const [bulkPending, setBulkPending] = useState(false)
  const [feedback, setFeedback] = useState<string | null>(null)

  const totalPages = Math.ceil(localVendors.length / PAGE_SIZE)
  const pageVendors = localVendors.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  function removeLocally(id: string) {
    setLocalVendors(prev => prev.filter(v => v.id !== id))
  }

  async function handleSetInactive(id: string) {
    startTransition(async () => {
      try {
        await setVendorInactive(id)
        removeLocally(id)
        setFeedback('Vendor hidden from directory.')
      } catch (e) {
        setFeedback(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
      }
    })
  }

  async function handleMarkPartial(id: string) {
    startTransition(async () => {
      try {
        await setVendorDisplayPartial(id)
        removeLocally(id)
        setFeedback('Vendor marked as Partial.')
      } catch (e) {
        setFeedback(`Error: ${e instanceof Error ? e.message : 'Unknown error'} (display_quality column may not exist yet — run the SQL first)`)
      }
    })
  }

  async function handleBulkHide() {
    if (!confirm(`Hide ALL ${localVendors.length} bare vendors from the public directory? This sets active=false for each one.`)) return
    setBulkPending(true)
    try {
      const ids = localVendors.map(v => v.id)
      await hideAllBareVendors(ids)
      setLocalVendors([])
      setPage(0)
      setFeedback(`✅ ${ids.length} bare vendors hidden from directory.`)
    } catch (e) {
      setFeedback(`Error: ${e instanceof Error ? e.message : 'Unknown error'}`)
    } finally {
      setBulkPending(false)
    }
  }

  return (
    <div>
      {/* Bulk action */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          {localVendors.length} bare vendors · page {page + 1} of {Math.max(1, totalPages)}
        </p>
        <button
          onClick={handleBulkHide}
          disabled={bulkPending || localVendors.length === 0}
          className="bg-red-600 hover:bg-red-700 text-white text-sm font-medium px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {bulkPending ? 'Hiding…' : `Hide All ${localVendors.length} Bare Listings`}
        </button>
      </div>

      {feedback && (
        <div className="mb-3 text-sm px-3 py-2 rounded-lg bg-blue-50 border border-blue-200 text-blue-700">
          {feedback}
          <button onClick={() => setFeedback(null)} className="ml-2 text-blue-400 hover:text-blue-600">✕</button>
        </div>
      )}

      {localVendors.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <div className="text-3xl mb-2">✅</div>
          <p>No bare vendors remaining.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="pb-2 pr-4">Company Name</th>
                  <th className="pb-2 pr-4">Province</th>
                  <th className="pb-2 pr-4">Category</th>
                  <th className="pb-2 pr-4">Claimed?</th>
                  <th className="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageVendors.map(v => (
                  <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-2 pr-4 font-medium text-gray-800">{v.company_name}</td>
                    <td className="py-2 pr-4 text-gray-500">{v.province || '—'}</td>
                    <td className="py-2 pr-4 text-gray-500 max-w-[160px] truncate">
                      {v.categories.length > 0 ? v.categories.join(', ') : '—'}
                    </td>
                    <td className="py-2 pr-4">
                      {v.user_id ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Claimed</span>
                      ) : (
                        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">Unclaimed</span>
                      )}
                    </td>
                    <td className="py-2 text-right space-x-2">
                      <button
                        onClick={() => handleSetInactive(v.id)}
                        disabled={isPending}
                        className="text-xs bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 px-2.5 py-1 rounded disabled:opacity-50"
                      >
                        Hide
                      </button>
                      <button
                        onClick={() => handleMarkPartial(v.id)}
                        disabled={isPending}
                        className="text-xs bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 px-2.5 py-1 rounded disabled:opacity-50"
                      >
                        Mark Partial
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-sm text-gray-400">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="text-sm text-gray-500 hover:text-gray-700 disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
