import { create } from 'zustand'
import type { UsageProvider } from '../domain/usage'

interface UsageStoreState {
  providers: UsageProvider[]
  stale: boolean
  lastSuccessAt: string | null
  setUsageData: (providers: UsageProvider[], stale?: boolean, lastSuccessAt?: string | null) => void
}

export const useUsageStore = create<UsageStoreState>((set) => ({
  providers: [],
  stale: false,
  lastSuccessAt: null,
  setUsageData: (providers, stale = false, lastSuccessAt = null) =>
    set({ providers, stale, lastSuccessAt }),
}))
