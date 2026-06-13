/** Primary toast API — Sonner (shadcn-compatible). */
import { toast as sonnerToast } from 'sonner'

export const toast = sonnerToast

export function toastSuccess(message: string) {
  return sonnerToast.success(message)
}

export function toastError(message: string) {
  return sonnerToast.error(message)
}

export function toastLoading(message: string) {
  return sonnerToast.loading(message)
}
