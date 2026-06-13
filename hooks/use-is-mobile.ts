'use client'

import { useMediaQuery } from 'usehooks-ts'

/** Matches Tailwind `md` breakpoint — use for drawer vs dialog patterns. */
export function useIsMobile(breakpoint = '(max-width: 767px)') {
  return useMediaQuery(breakpoint)
}
