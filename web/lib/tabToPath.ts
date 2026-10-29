import type { TabName } from '../domain/schemas/routeParams'

export function tabToPath(t: TabName, id?: string | null): string {
  if (t === 'chat') return id ? `/chat/${id}` : '/chat'
  return '/panels'
}
