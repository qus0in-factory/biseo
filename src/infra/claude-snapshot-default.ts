import { resolve } from 'node:path'

const name = 'claude-usage.json'

export function snapshotDefaultPath() {
  const root = process.env.BISEO_STATE_DIR || resolve(process.cwd(), 'data')
  return resolve(root, name)
}
