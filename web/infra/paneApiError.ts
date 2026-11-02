import { isHTTPError } from 'ky'

export function apiErrorCode(error: unknown): string | null {
  if (!isHTTPError(error)) return null
  const data = error.data
  if (!data || typeof data !== 'object' || !('error' in data)) return null
  return typeof data.error === 'string' ? data.error : null
}
