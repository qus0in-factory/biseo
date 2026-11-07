import { closeSync, openSync, readSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import type { PaneModel } from './pane-model-parse.js'
const id = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
export function claudeSessionModel(cwd: string, sessionId: string): PaneModel | null {
  const root = process.env.BISEO_CLAUDE_PROJECTS ?? join(homedir(), '.claude/projects')
  const file = join(root, cwd.replaceAll('/', '-'), `${sessionId}.jsonl`)
  let text = ''
  try {
    const fd = openSync(file, 'r')
    const buf = Buffer.alloc(65536)
    const n = readSync(fd, buf, 0, buf.length, 0)
    closeSync(fd)
    text = buf.toString('utf8', 0, n)
  } catch { return null }
  const name = text.match(/"marketingName":"([^"]+)"/)?.[1]
  const modelId = name ? id(name) : ''
  return modelId ? { modelId, provider: 'claude' } : null
}
