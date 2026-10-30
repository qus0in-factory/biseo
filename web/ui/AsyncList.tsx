import type { ReactNode } from 'react'
import type { AsyncState } from '../domain/asyncState'
import { AsyncFallback } from './AsyncFallback'
import { AsyncRefreshing } from './AsyncRefreshing'
import r from '../resources.json'

type P<T> = {
  state: AsyncState<T[]>
  skeleton: ReactNode
  empty: ReactNode
  errorText: string
  onRetry?: () => void
  children: (items: T[]) => ReactNode
}

export function AsyncList<T>({ state, skeleton, empty, errorText, onRetry, children }: P<T>) {
  if (state.status === 'loading' && !state.data) return <>{skeleton}</>
  if (state.status === 'error' && !state.data) return <AsyncFallback errorText={errorText} onRetry={onRetry} />
  if (state.status === 'empty') return <>{empty}</>
  return (
    <>
      {children(state.data ?? [])}
      {state.status === 'error' && <AsyncFallback errorText={errorText} onRetry={onRetry} inline />}
      {state.status === 'loading' && <AsyncRefreshing />}
    </>
  )
}
