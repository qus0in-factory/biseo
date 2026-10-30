import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const read = (f: string) => readFileSync(fileURLToPath(new URL(`../migrations/${f}`, import.meta.url).href), 'utf8')
export const SCHEMA = `${read('0001_timeline.sql')}\n${read('0002_usage.sql')}\n${read('0003_sync.sql')}`
