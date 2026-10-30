import type { AsyncState } from './asyncState'

export const listState = <T>(items: T[], loading: boolean, error: string | null): AsyncState<T[]> => {
  if (loading) return { status: 'loading', data: items.length ? items : undefined }
  if (error) return { status: 'error', error, data: items.length ? items : undefined }
  return items.length ? { status: 'ready', data: items } : { status: 'empty' }
}
