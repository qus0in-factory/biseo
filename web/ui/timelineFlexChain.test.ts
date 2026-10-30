import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
const classes = (f: string) => src(f).match(/className="([^"]+)"/)?.[1].split(/\s+/) ?? []

test('height-constrained vertical ancestors are shrinkable flex columns', () => {
  for (const f of ['./AppFrame.tsx', './DashboardView.tsx', './WorkspaceMain.tsx', './TimelineSection.tsx']) {
    const c = classes(f)
    assert.ok(c.includes('flex-col'), `${f} flex-col`)
    assert.ok(c.includes('min-h-0'), `${f} min-h-0`)
  }
})

test('dashboard row bounds its workspace child', () => {
  assert.match(src('./DashboardView.tsx'), /className="[^"]*min-h-0[^\"]*flex-1 gap-4"[\s\S]*<WorkspaceMain/)
  assert.match(src('./WorkspaceMain.tsx'), /className="[^"]*min-h-0[^\"]*flex-col"[\s\S]*<TimelineSection/)
})
