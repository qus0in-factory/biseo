import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('empty timeline flexes so the composer stays at the section bottom', () => {
  assert.match(src('./TimelineView.tsx'), /items\.length === 0[\s\S]*flex-1/)
})

test('reason affordances expose a 44px hit target', () => {
  const reason = src('./ReasonDetails.tsx')
  assert.match(reason, /pr-\[31px\]/)
  assert.match(reason, /-mr-\[31px\]/)
  assert.match(src('./ReasonTip.tsx'), /before:-inset-2\.5/)
})

test('chat surfaces use color tokens', () => {
  const files = [
    'AppFrame.tsx',
    'ComposerShell.tsx',
    'ComposerCapsule.tsx',
    'ReasonDetails.tsx',
    'AgentBubble.tsx',
    'SendRoundButton.tsx',
    'JumpToBottomButton.tsx',
    '../components/ui/button-variants.ts',
    '../components/ui/badge.tsx',
  ]
  for (const f of files) {
    assert.doesNotMatch(src(`./${f}`), /\b(?:bg|text)-white\b/, f)
  }
})
{
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
const classes = (f: string) => src(f).match(/className="([^"]+)"/)?.[1].split(/\s+/) ?? []

test('height-constrained vertical ancestors are shrinkable flex columns', () => {
  for (const f of ['./AppFrame.tsx', './DashboardView.tsx', './WorkspaceMain.tsx', './TimelineSection.tsx']) {
    const c = classes(f)
    assert.ok(c.includes('flex-col'), `${f} flex-col`)
    assert.ok(c.includes('min-h-0'), `${f} min-h-0`)
  }
})

test('timeline section can shrink horizontally', () => {
  assert.ok(classes('./TimelineSection.tsx').includes('min-w-0'))
})

test('dashboard row bounds its workspace child', () => {
  assert.match(src('./DashboardView.tsx'), /className="[^"]*min-h-0[^\"]*flex-1 gap-4"[\s\S]*<WorkspaceMain/)
  assert.match(src('./WorkspaceMain.tsx'), /className="[^"]*min-h-0[^\"]*flex-col"[\s\S]*<TimelineSection/)
})
}
const section = readFileSync(new URL('./TimelineSection.tsx', import.meta.url), 'utf8')
const header = readFileSync(new URL('./TimelineHeader.tsx', import.meta.url), 'utf8')

test('timeline title has a bold, decorative icon header and token divider', () => {
  assert.match(section, /<TimelineHeader\s*\/>/)
  assert.match(header, /import \{ History \} from 'lucide-react'/)
  assert.match(header, /border-b border-border[^"]*font-bold/)
  assert.match(header, /<History[^>]*aria-hidden="true"[^>]*\/>\s*\{r\.timelineTitle\}/)
})
{
const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('app shell uses the stable small viewport', () => {
  const body = src('../base.css').match(/\n  body \{([\s\S]*?)\n  \}/)?.[1] ?? ''
  assert.match(body, /min-height: 100svh;/)
  assert.doesNotMatch(body, /100dvh|visual-viewport/)
  assert.match(src('./AppFrame.tsx'), /h-\[calc\(100svh-[\s\S]*flex flex-col overflow-hidden/)
})

test('dashboard flexes to the footer and scrolls only its timeline', () => {
  const text = src('./TimelineSection.tsx')
  assert.match(text, /className="flex min-h-0 min-w-0 flex-1 flex-col"/)
  assert.match(text, /border-b border-border">\s*<TimelineContents/)
  assert.match(src('./TimelineContents.tsx'), /<TimelineView/)
  assert.match(text, /<\/div>\s*<MessageComposer/)
  assert.doesNotMatch(text, /12rem|visual-viewport/)
  assert.match(src('./TimelineScrollBody.tsx'), /overflow-y-auto/)
})
}
