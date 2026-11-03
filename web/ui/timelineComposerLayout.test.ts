import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const s = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('bubbles minimize borders and standardise rhythm', () => {
  assert.match(s('./UserBubble.tsx'), /border-0[\s\S]*bg-muted/)
  assert.match(s('./AgentBubble.tsx'), /border-border\/(?:40|50)/)
  assert.match(s('./TimelineScrollBody.tsx'), /gap-4/)
})

test('headers ensure meta contrast and alignment', () => {
  for (const f of ['./AgentHeader.tsx', './TimelineItemHeader.tsx']) {
    const text = s(f)
    assert.match(text, /font-mono[\s\S]*agentKind/)
    assert.match(text, /text-muted-foreground[\s\S]*tabular-nums/)
  }
})

test('composer controls align vertically with 44px', () => {
  assert.match(s('./ComposerCapsule.tsx'), /rounded-2xl/)
  assert.match(s('./ComposerField.tsx'), /min-h-\[2\.75rem\]/)
  assert.match(s('./ComposerControls.tsx'), /items-center/)
  assert.match(s('./RecentPullButton.tsx'), /variant="ghost"[\s\S]*h-11 w-11/)
  assert.match(s('./SendRoundButton.tsx'), /h-11 w-11/)
})
