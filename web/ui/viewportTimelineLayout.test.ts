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
  const text = src('./TimelineSection.tsx')
  assert.match(text, /className="flex min-h-0 min-w-0 flex-1 flex-col"/)
  assert.match(text, /border-b border-border">\s*<TimelineContents/)
  assert.match(src('./TimelineContents.tsx'), /<TimelineView/)
  assert.match(text, /<\/div>\s*<MessageComposer/)
  assert.doesNotMatch(text, /12rem|visual-viewport/)
  assert.match(src('./TimelineScrollBody.tsx'), /overflow-y-auto/)
})
