import { useCallback, useState } from 'react'
import type { PaneSummary } from '../domain/timeline'
import { loadingState } from '../domain/asyncState'
import { paneListState, paneOfflineState } from './paneAsyncState'
export function usePaneSnapshot() {
 const [s, setS] = useState(() => loadingState<PaneSummary[]>())
 const snap = useCallback((l: PaneSummary[]) => setS(paneListState(l)), [])
 const off = useCallback(() => setS(x => paneOfflineState(x)), [])
 return {s, setS, snap, off}
}
