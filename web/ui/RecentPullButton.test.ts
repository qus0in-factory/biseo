import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('recent pull sits beside send, not above the timeline', () => {
  const controls = src('./ComposerControls.tsx')
  const at = controls.indexOf('<RecentPullButton')
  assert.ok(at > 0 && at < controls.indexOf('<SendRoundButton'))
  assert.match(src('./TimelineSection.tsx'), /useTimelinePull/)
  assert.doesNotMatch(src('./TimelineSection.tsx'), /<RecentPullButton/)
})

test('pull keeps its label, 44px target and recentPull-only action', () => {
  const button = src('./RecentPullButton.tsx')
  assert.match(button, /aria-label=\{resources\.recentPull\}/)
  assert.match(button, /title=\{resources\.recentPull\}/)
  assert.match(button, /h-11 w-11/)
  assert.match(button, /Download/)
  assert.match(button, /disabled=\{pull\.isPending\}/)
  assert.match(button, /onClick=\{\(\) => pull\.mutate\(\)\}/)
  assert.doesNotMatch(button, /cancel/i)
})
