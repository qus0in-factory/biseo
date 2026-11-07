import assert from 'node:assert/strict'
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import { claudeSessionModel } from './claude-session-model.js'

test('claude session marketing name becomes the pane model', () => {
  const root = mkdtempSync(join(tmpdir(), 'biseo-claude-'))
  const cwd = '/tmp/mandalart'
  const dir = join(root, cwd.replaceAll('/', '-'))
  mkdirSync(dir)
  writeFileSync(join(dir, 'ses.jsonl'), '{"attachment":{"type":"model","identity":{"modelId":"claude-opus-5-5","marketingName":"Opus 5.5"}}}\n')
  process.env.BISEO_CLAUDE_PROJECTS = root
  assert.deepEqual(claudeSessionModel(cwd, 'ses'), { modelId: 'opus-5.5', provider: 'claude' })
  assert.equal(claudeSessionModel(cwd, 'missing'), null)
  delete process.env.BISEO_CLAUDE_PROJECTS
})
