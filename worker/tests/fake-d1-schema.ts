import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const read = (f: string) => readFileSync(fileURLToPath(new URL(`../migrations/${f}`, import.meta.url).href), 'utf8')
export const SCHEMA = `${read('0001_timeline.sql')}\n${read('0002_usage.sql')}\n${read('0003_sync.sql')}\n${read('0004_usage_metrics.sql')}\n${read('0005_remove_active_pane_guard.sql')}\n${read('0006_usage_reason.sql')}\n${read('0007_usage_period.sql')}`
