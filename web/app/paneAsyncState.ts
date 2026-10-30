import type { PaneSummary } from '../domain/timeline'
import { markOffline } from '../domain/markOffline'
import { dataOf, emptyState, errorState, readyState } from '../domain/asyncState'
import type { AsyncState } from '../domain/asyncState'

export const paneListState = (list: PaneSummary[]): AsyncState<PaneSummary[]> =>
  list.length ? readyState(list) : emptyState()

export const paneOfflineState = (state: AsyncState<PaneSummary[]>): AsyncState<PaneSummary[]> => {
  const next = markOffline(dataOf(state) ?? [])
  return errorState('connection_unavailable', next.length ? readyState(next) : emptyState())
}
