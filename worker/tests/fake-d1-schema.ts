import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
const read = (f: string) => readFileSync(fileURLToPath(new URL(`../migrations/${f}`, import.meta.url).href), 'utf8')
export const SCHEMA = ['0001_timeline.sql','0002_usage.sql','0003_sync.sql',
 '0004_usage_metrics.sql','0005_remove_active_pane_guard.sql',
 '0006_usage_reason.sql','0007_queue_lease.sql','0008_queue_retry.sql',
 '0009_pin_auth.sql'].map(read).join('\n')
