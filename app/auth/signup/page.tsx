'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase-browser'
import { isFreeEmailDomain } from '@/lib/free-email-domains'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    company_name: '',
    email: '',
    password: '',
    tender_alerts_consent: false,
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [alreadyLoggedIn, setAlreadyLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setAlreadyLoggedIn(true)
    }
    checkAuth()
  }, [])

  const emailDomain = formData.email.includes('@')
    ? formData.email.split('@')[1]
    : ''

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')

    const { email, password, company_name } = formData

    if (!company_name.trim()) {
      setError('Company name is required.')
      return
    }

    if (!email || !password) {
      setError('Email and password are required.')
      return
    }

    if (isFreeEmailDomain(email)) {
      setError(
        'Please use your company email address. Free email providers (Gmail, Yahoo, etc.) are not accepted.'
      )
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name,
          tender_alerts_consent: formData.tender_alerts_consent,
          tender_alerts_consent_date: formData.tender_alerts_consent ? new Date().toISOString() : null,
        },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/auth/claim`,
      },
    })

    setLoading(false)

    if (signUpError) {
      setError(signUpError.message)
      return
    }

    setSuccess(email.split('@')[1])
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your inbox</h2>
          <p className="text-gray-600 mb-1">
            We sent a verification link to your email at
          </p>
          <p className="font-semibold text-[#0a1628] text-lg mb-6">@{success}</p>
          <p className="text-sm text-gray-500">
            Click the link in the email to verify your account, then you&apos;ll be able to claim your listing.
          </p>
          <p className="text-sm text-gray-400 mt-4">
            Didn&apos;t get it? Check your spam folder or{' '}
            <button
              onClick={() => setSuccess('')}
              className="text-amber-600 hover:underline"
            >
              try again
            </button>
            .
          </p>
        </div>
      </div>
    )
  }

  if (alreadyLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
          <Link href="/" className="inline-flex justify-center mb-6">
            <Image src="/logo/logo-medium-light.svg" alt="Energy Directory" width={160} height={43} />
          </Link>
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">👋</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You&apos;re already signed in</h2>
          <p className="text-gray-500 text-sm mb-6">Go to your dashboard or add a new listing.</p>
          <div className="flex flex-col gap-3">
            <Link href="/dashboard" className="block w-full bg-[#0a1628] hover:bg-[#0d1f35] text-white font-semibold py-3 rounded-xl transition-colors text-sm">
              Go to Dashboard
            </Link>
            <Link href="/auth/claim" className="block w-full bg-amber-500 hover:bg-amber-400 text-[#0a1628] font-semibold py-3 rounded-xl transition-colors text-sm">
              + Add New Listing
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex mb-6">
            <Image src="/logo/logo-medium-light.svg" alt="Energy Directory" width={160} height={43} />
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Create your account</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Use your company email to verify your business
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Name
              </label>
              <input
                type="text"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Acme Energy Services Ltd."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Company Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="you@yourcompany.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                required
              />
              {emailDomain && !isFreeEmailDomain(formData.email) && formData.email.includes('@') && (
                <p className="text-xs text-green-600 mt-1">✓ Using company domain @{emailDomain}</p>
              )}
              {emailDomain && isFreeEmailDomain(formData.email) && (
                <p className="text-xs text-red-500 mt-1">✗ Free email providers are not accepted</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="At least 8 characters"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent text-sm"
                required
                minLength={8}
              />
            </div>

            <div className="flex items-start gap-3 pt-1">
              <input
                type="checkbox"
                id="tender_alerts_consent"
                checked={formData.tender_alerts_consent}
                onChange={(e) => setFormData({ ...formData, tender_alerts_consent: e.target.checked })}
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-amber-500 focus:ring-amber-400 cursor-pointer"
              />
              <label htmlFor="tender_alerts_consent" className="text-xs text-gray-500 cursor-pointer leading-relaxed">
                Send me free weekly tender alerts for government contracts relevant to my industry category (Canadian federal &amp; provincial procurement). I can unsubscribe anytime.
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-400 disabled:bg-amber-300 text-[#0a1628] font-semibold py-2.5 rounded-lg transition-colors text-sm"
            >
              {loading ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-amber-600 hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">
          By creating an account you agree to our{' '}
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          {' '}and{' '}
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
