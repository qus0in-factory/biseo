import assert from 'node:assert/strict'
import { existsSync } from 'node:fs'
import test from 'node:test'
const parser = 'dist/server/src/domain/pane-model-parse.js'
const names = 'dist/server/src/domain/claude-model-names.js'
test('compiled server loads cwd config', { skip: !existsSync(parser) }, async () => {
  const parsed = await import(`../../${parser}`)
  const named = await import(`../../${names}`)
  assert.deepEqual(parsed.parseModelDisplay('Grok 4.7 xAI', 'opencode'), { modelId: 'grok-4.7', provider: 'grok' })
  assert.equal(named.claudeModelName(['Opus 5.5']), 'Opus 5.5')
})
