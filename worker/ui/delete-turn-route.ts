import { deleteReservation } from './delete-reservation.js'
import { type App, checkCsrf, jsonNoStore, requireOwner } from './timeline-guards.js'
import { requireDb } from './storage-guard.js'

export function registerDeleteTurn(app: App) {
  app.delete('/api/turns/:requestId', async (c) => {
    const csrf = checkCsrf(c)
    if (csrf) return csrf
    const a = await requireOwner(c)
    if (!a.ok) return a.res
    const d = requireDb(c)
    if (!d.ok) return d.res
    const id = c.req.param('requestId')
    const r = await deleteReservation(c,d.db,id,a.claims.sub)
    return jsonNoStore(c, r.body, r.status)
  })
}
