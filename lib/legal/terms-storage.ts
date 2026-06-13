export const TERMS_STORAGE_KEY = 'wld5050-terms-agreed-v1'

export function hasAcceptedTerms(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(TERMS_STORAGE_KEY) === 'true'
}

export function acceptTerms(): void {
  localStorage.setItem(TERMS_STORAGE_KEY, 'true')
}
