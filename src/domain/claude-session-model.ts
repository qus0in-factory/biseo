import { homedir } from 'node:os'
import { join } from 'node:path'
import { claudeMarketingName } from './claude-marketing-name.js'
import { claudeSessionHead } from './claude-session-head.js'
import type { PaneModel } from './pane-model-parse.js'
const id = (s: string) => s.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '')
export function claudeSessionModel(cwd: string, sessionId: string): PaneModel | null {
  const root = process.env.BISEO_CLAUDE_PROJECTS ?? join(homedir(), '.claude/projects')
  const text = claudeSessionHead(join(root, cwd.replaceAll('/', '-'), `${sessionId}.jsonl`))
  const name = text ? claudeMarketingName(text) : null
  const modelId = name ? id(name) : ''
  return modelId ? { modelId, provider: 'claude' } : null
}
