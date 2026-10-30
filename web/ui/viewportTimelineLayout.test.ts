import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('app shell uses the stable small viewport', () => {
  const body = src('../base.css').match(/\n  body \{([\s\S]*?)\n  \}/)?.[1] ?? ''
  assert.match(body, /min-height: 100svh;/)
  assert.doesNotMatch(body, /100dvh|visual-viewport/)
  assert.match(src('./AppFrame.tsx'), /h-\[calc\(100svh-[\s\S]*flex flex-col overflow-hidden/)
})

test('dashboard flexes to the footer and scrolls only its timeline', () => {
  const section = src('./TimelineSection.tsx')
  assert.match(section, /className="flex min-h-0 flex-1 flex-col"/)
  assert.match(section, /border-b border-border">\s*<TimelineView/)
  assert.match(section, /<\/div>\s*<MessageComposer/)
  assert.doesNotMatch(section, /12rem|visual-viewport/)
  assert.match(src('./TimelineView.tsx'), /overflow-y-auto/)
})
