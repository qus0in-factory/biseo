import type { ReactNode } from 'react'
import type { AsyncState } from '../domain/asyncState'
import { AsyncFallback } from './AsyncFallback'
import { AsyncRefreshing } from './AsyncRefreshing'
import { LoadingState } from './LoadingState'

type P<T> = {
  state: AsyncState<T[]>
  rows?: number
  empty: ReactNode
  errorText: string
  onRetry?: () => void
  refreshing?: boolean
  children: (items: T[]) => ReactNode
}

export function AsyncList<T>({ state, rows = 3, empty, errorText, onRetry, refreshing = true, children }: P<T>) {
  if (state.status === 'loading' && !state.data) return <LoadingState rows={rows} />
  if (state.status === 'error' && !state.data) return <AsyncFallback errorText={errorText} onRetry={onRetry} />
  if (state.status === 'empty') return <div className="mt-4">{empty}</div>
  return (
    <>
      {children(state.data ?? [])}
      {state.status === 'error' && <AsyncFallback errorText={errorText} onRetry={onRetry} inline />}
      {state.status === 'loading' && refreshing && <AsyncRefreshing />}
    </>
  )
}
