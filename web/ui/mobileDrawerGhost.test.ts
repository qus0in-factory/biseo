import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync as read } from 'node:fs'

test('drawer ghost overrides are scoped to its header without replacing shared close control', () => {
  const out = read(new URL('./MobileDrawer.tsx', import.meta.url), 'utf8')
  assert.match(out, /\[&>div:first-child_button\]:border-none/)
  assert.match(out, /\[&>div:first-child_button\]:text-muted-foreground/)
  assert.match(out, /\[&>div:first-child_button:hover\]:text-foreground/)
  assert.match(out, /<SheetContent title=\{r.panesTitle\}/)
  assert.doesNotMatch(out, /HeaderMenuButton/)
})
