import { copyFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
const files = ['config/model-suffixes.json', 'config/claude-models.json']
for (const file of files) {
  const dest = join('dist/server', file)
  mkdirSync(dirname(dest), { recursive: true })
  copyFileSync(file, dest)
}
