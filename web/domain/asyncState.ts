export type AsyncState<T> =
  | { status: 'loading'; data?: T }
  | { status: 'ready'; data: T }
  | { status: 'empty' }
  | { status: 'error'; error: string; data?: T }

export const dataOf = <T>(state?: AsyncState<T>): T | undefined =>
  state && 'data' in state ? state.data : undefined

export const loadingState = <T>(prev?: AsyncState<T>): AsyncState<T> => ({
  status: 'loading',
  data: dataOf(prev),
})

export const readyState = <T>(data: T): AsyncState<T> => ({ status: 'ready', data })

export const emptyState = <T>(): AsyncState<T> => ({ status: 'empty' })

export const errorState = <T>(error: string, prev?: AsyncState<T>): AsyncState<T> => ({
  status: 'error',
  error,
  data: dataOf(prev),
})
