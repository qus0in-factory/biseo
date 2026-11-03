import { queueFixture } from './queue-fixture.js'
import type { TurnRecord } from '../domain/timeline-record.js'
import { toItem } from '../app/timeline-map.js'

export async function liveQueueFixture() {
  const { db, put } = await queueFixture()
  for (const id of ['first', 'middle', 'last']) await put(id)
  await db.prepare('UPDATE timeline_turns SET created_at=?').bind(new Date().toISOString()).run()
  const sent: string[] = []
  const q = {
    target: async () => ({ terminalId: 'generation-1', ready: true }),
    execute: async (row: TurnRecord) => { sent.push(row.requestId); return true },
  }
  return { db, sent, q, completed: (row: TurnRecord) => ({
    getTurn: async () => ({ ok: true as const, data: {
      ...toItem(row), status: 'completed' as const, responseText: 'local result',
    } }),
  }) }
}
