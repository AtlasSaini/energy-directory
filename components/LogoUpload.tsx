'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/lib/supabase-browser'

interface LogoUploadProps {
  currentUrl?: string
  onUpload: (url: string) => void
}

export default function LogoUpload({ currentUrl, onUpload }: LogoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(currentUrl || null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return

    // Validate
    const allowed = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
    if (!allowed.includes(file.type)) {
      setError('Please upload a PNG, JPG, SVG, or WebP file.')
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('File must be under 2MB.')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const ext = file.name.split('.').pop()
      const path = `${user.id}/logo.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('vendor-logos')
        .upload(path, file, { upsert: true, contentType: file.type })

      if (uploadError) throw uploadError

      const { data: { publicUrl } } = supabase.storage
        .from('vendor-logos')
        .getPublicUrl(path)

      setPreview(publicUrl)
      onUpload(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Company Logo</label>

      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-amber-400 hover:bg-amber-50 transition-all"
      >
        {preview ? (
          <div className="flex flex-col items-center gap-2">
            <img src={preview} alt="Logo preview" className="h-16 max-w-[200px] object-contain" />
            <span className="text-xs text-gray-500">Click to replace</span>
          </div>
        ) : (
          <>
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl">🖼️</div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-700">
                {uploading ? 'Uploading...' : 'Drop your logo here or click to browse'}
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, SVG or WebP — max 2MB</p>
            </div>
          </>
        )}

        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div className="bg-amber-500 h-1.5 rounded-full animate-pulse w-1/2" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
      />

      {error && <p className="text-xs text-red-500">{error}</p>}
      {preview && !uploading && (
        <p className="text-xs text-green-600">✓ Logo saved</p>
      )}
    </div>
  )
}
