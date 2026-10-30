import type { Dispatch, SetStateAction } from 'react'
import type { UsageApiPort, UsageProvider, UsageResponse } from '../domain/usage'
import { emptyState, errorState, loadingState, readyState } from '../domain/asyncState'
import type { AsyncState } from '../domain/asyncState'

export const loadUsage = async (
  api: UsageApiPort,
  live: { current: boolean },
  setState: Dispatch<SetStateAction<AsyncState<UsageProvider[]>>>,
): Promise<UsageResponse | null> => {
  setState((s) => loadingState(s))
  try {
    const r = await api.getUsage()
    if (!live.current) return null
    const providers = r.providers ?? []
    setState(providers.length ? readyState(providers) : emptyState())
    return r
  } catch {
    if (live.current) setState((s) => errorState('connection_unavailable', s))
    return null
  }
}
