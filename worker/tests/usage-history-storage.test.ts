import test from 'node:test'
import assert from 'node:assert/strict'
import { createFakeD1 } from '../test-util/fake-d1.js'
import { writeHistory } from '../infra/d1-usage-history-write.js'
import { readHistory } from '../infra/d1-usage-history-read.js'
import { historyPoint } from '../../shared/usage-history-fixture.js'

test('history appends idempotently and prunes only expired observations', async () => {
  const db = createFakeD1()
  await writeHistory(db, [historyPoint(1, 10, 1), historyPoint(2, 20, 2)], 0)
  await writeHistory(db, [historyPoint(2, 20, 2), historyPoint(3, 30, 3)], 2)
  assert.deepEqual((await readHistory(db, 'codex', 0)).map(row => row.observed), [2, 3])
  assert.equal((await readHistory(db, 'claude', 0)).length, 0)
  assert.equal((await readHistory(db, 'codex', 3)).length, 1)
})
