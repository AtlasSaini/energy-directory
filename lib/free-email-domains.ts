export const FREE_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.ca',
  'hotmail.com',
  'hotmail.ca',
  'outlook.com',
  'outlook.ca',
  'live.com',
  'live.ca',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'protonmail.com',
  'proton.me',
  'tutanota.com',
  'ymail.com',
  'aol.com',
  'shaw.ca',
  'telus.net',
  'rogers.com',
  'bell.net',
  'sympatico.ca',
])

// TEMP: whitelisted for owner testing — remove before public launch
const TEMP_OWNER_WHITELIST = new Set(['me.com'])

export function isFreeEmailDomain(email: string): boolean {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return false
  if (TEMP_OWNER_WHITELIST.has(domain)) return false // owner testing bypass
  return FREE_EMAIL_DOMAINS.has(domain)
}

export function extractDomain(email: string): string {
  return email.split('@')[1]?.toLowerCase() ?? ''
}
