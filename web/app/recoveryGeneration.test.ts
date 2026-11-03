import assert from 'node:assert/strict'
import test from 'node:test'
import { recoveryFixture } from './recoveryTestFixture'

test('drops pending recovery from before A -> B -> A', async () => {
  const f = recoveryFixture()
  const old = f.run()
  f.refresh('B')
  f.refresh('A')
  f.pending.resolve({ ...f.item, status: 'completed' })
  await old
  assert.deepEqual(f.applied, [])
  await f.run()
  assert.deepEqual(f.applied, [{ ...f.item, status: 'completed' }])
})

test('current recovery uses the latest update within its generation', async () => {
  const f = recoveryFixture()
  const current = f.run()
  const applied: unknown[] = []
  f.refs.refresh([f.item], x => applied.push(x), 'A')
  const result = { ...f.item, status: 'completed' as const }
  f.pending.resolve(result)
  await current
  assert.deepEqual(applied, [result])
  assert.deepEqual(f.applied, [])
})
