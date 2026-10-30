import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const section = readFileSync(new URL('./TimelineSection.tsx', import.meta.url), 'utf8')
const header = readFileSync(new URL('./TimelineHeader.tsx', import.meta.url), 'utf8')

test('timeline title has a bold, decorative icon header and token divider', () => {
  assert.match(section, /<TimelineHeader\s*\/>/)
  assert.match(header, /import \{ History \} from 'lucide-react'/)
  assert.match(header, /border-b border-border[^"]*font-bold/)
  assert.match(header, /<History[^>]*aria-hidden="true"[^>]*\/>\s*\{r\.timelineTitle\}/)
})
