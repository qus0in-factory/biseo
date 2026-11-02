import { useEffect, useState } from 'react'
import type { AsyncState } from '../domain/asyncState'
import { loadingState, readyState } from '../domain/asyncState'
import type { UsageProvider } from '../domain/usage'
import { useUsageStore } from './useUsageStore'

export function useUsageState() {
  const cached = useUsageStore.getState().providers
  const initial: AsyncState<UsageProvider[]> = cached.length ? readyState(cached) : loadingState()
  const result = useState<AsyncState<UsageProvider[]>>(() => initial)
  const status = result[0].status
  useEffect(() => {
    useUsageStore.setState({ status })
  }, [status])
  return result
}
