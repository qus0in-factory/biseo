import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync as read } from 'node:fs'

test('drawer ghost header comes from shared sheet defaults without DOM overrides', () => {
  const drawer = read(new URL('./MobileDrawer.tsx', import.meta.url), 'utf8')
  assert.doesNotMatch(drawer, /\[&>div:first-child_button\]/)
  assert.doesNotMatch(drawer, /className="\[&/)
  assert.match(drawer, /<SheetContent title=\{r\.panesTitle\}/)
  assert.match(drawer, /headerActions=\{<PaneListToggle\/>\}/)
  assert.doesNotMatch(drawer, /HeaderMenuButton/)

  const header = read(new URL('../components/ui/sheet.header.tsx', import.meta.url), 'utf8')
  assert.match(header, /<Button[^>]*variant="ghost"/)
  assert.doesNotMatch(header, /variant="outline"/)
})
