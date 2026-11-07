import { after } from 'node:test'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const previous = process.env.BISEO_CLAUDE_SNAPSHOT_PATH
const dir = mkdtempSync(join(tmpdir(), 'biseo-claude-test-'))
process.env.BISEO_CLAUDE_SNAPSHOT_PATH = join(dir, 'usage.json')

after(() => {
  if (previous === undefined) delete process.env.BISEO_CLAUDE_SNAPSHOT_PATH
  else process.env.BISEO_CLAUDE_SNAPSHOT_PATH = previous
  rmSync(dir, { recursive: true, force: true })
})
