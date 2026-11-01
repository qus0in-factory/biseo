import { type App, jsonNoStore, requireOwner } from './timeline-guards.js'
import { requireDb } from './storage-guard.js'
import { readHistory } from '../infra/d1-usage-history-read.js'
import { historyConfig } from '../app/usage-history-config.js'
import { historyRatio } from '../../shared/usage-history-ratio.js'

export function registerUsageHistoryRoute(app: App) {
  app.get('/api/usage/history/:provider', async c => {
    const auth = await requireOwner(c); if (!auth.ok) return auth.res
    const storage = requireDb(c); if (!storage.ok) return storage.res
    const config = historyConfig(c.env)
    const points = await readHistory(storage.db, c.req.param('provider'), Date.now() - config.retention)
    return jsonNoStore(c, historyRatio(points, config.minimum), 200)
  })
}
