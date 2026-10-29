import test from 'node:test'
import assert from 'node:assert/strict'
import { limitScreen } from './limit-screen.js'
import type { HerdrPort } from './ports.js'

const fake = (lines: string[], calls: string[]) =>
  ({
    readRecent: async (id: string) => {
      calls.push(id)
      return lines
    },
  }) as unknown as HerdrPort

test('limit screen classifies configured markers into a boolean only', async () => {
  const calls: string[] = []
  const screen = limitScreen(fake(['5H LIMIT reached for private-account'], calls), ['5h limit'])
  assert.equal(await screen.classify('w:p1'), true)
  assert.deepEqual(calls, ['w:p1'])
  assert.equal(await limitScreen(fake(['5h limit'], calls), []).classify('w:p1'), false)
})
