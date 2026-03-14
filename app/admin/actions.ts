'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase'

export async function setVendorInactive(vendorId: string) {
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('vendors')
    .update({ active: false })
    .eq('id', vendorId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/vendors')
}

export async function setVendorDisplayPartial(vendorId: string) {
  const supabase = createAdminClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('vendors')
    .update({ display_quality: 'partial' })
    .eq('id', vendorId)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
}

export async function hideAllBareVendors(vendorIds: string[]) {
  if (vendorIds.length === 0) return
  const supabase = createAdminClient()
  const { error } = await supabase
    .from('vendors')
    .update({ active: false })
    .in('id', vendorIds)
  if (error) throw new Error(error.message)
  revalidatePath('/admin')
  revalidatePath('/vendors')
}
