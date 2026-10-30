import { useNotificationStore } from '../app/notificationStore'
import { listState } from '../domain/asyncListState'
import { AsyncList } from './AsyncList'
import { ListSkeleton } from './ListSkeleton'
import { NotificationBody } from './NotificationBody'
import r from '../resources.json'

export function NotificationList() {
  const items = useNotificationStore((s) => s.items)
  const read = useNotificationStore((s) => s.read)
  const readAll = useNotificationStore((s) => s.readAll)
  const state = listState(items, false, null)
  return (
    <AsyncList
      state={state}
      skeleton={<ListSkeleton rows={3} />}
      empty={<p className="text-sm text-muted-foreground">{r.notifyEmpty}</p>}
      errorText={r.notifyError}
    >
      {(list) => <NotificationBody items={list} onRead={read} onReadAll={readAll} />}
    </AsyncList>
  )
}
