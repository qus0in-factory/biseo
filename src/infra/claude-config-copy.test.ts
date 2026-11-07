import test from 'node:test'
import assert from 'node:assert/strict'
import { claudeBackoffCfg, CLAUDE_BACKOFF_DEFAULT } from './claude-oauth-config.js'

test('missing config returns an independent default copy', () => {
  const cfg = claudeBackoffCfg('/nonexistent/claude-config.json')
  const before = { ...CLAUDE_BACKOFF_DEFAULT }
  cfg.initialMs++
  assert.deepEqual(CLAUDE_BACKOFF_DEFAULT, before)
  assert.deepEqual(claudeBackoffCfg('/nonexistent/claude-config.json'), before)
})
