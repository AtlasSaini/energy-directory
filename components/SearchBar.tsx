'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder?: string
  defaultValue?: string
  className?: string
}

export default function SearchBar({ placeholder = 'Search vendors, categories...', defaultValue = '', className = '' }: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/vendors?q=${encodeURIComponent(query.trim())}`)
    } else {
      router.push('/vendors')
    }
  }

  return (
    <form onSubmit={handleSubmit} className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-gray-900 bg-white text-sm sm:text-base"
        />
      </div>
      <button
        type="submit"
        className="bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold px-6 py-3 rounded-lg transition-colors whitespace-nowrap"
      >
        Search
      </button>
    </form>
  )
}
