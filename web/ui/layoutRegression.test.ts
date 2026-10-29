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
