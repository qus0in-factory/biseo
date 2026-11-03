import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('UsageModal',()=>{
  it('has bookmarked tab and empty guidance',()=>{
    const src = readFileSync(new URL('./UsageTabList.tsx', import.meta.url), 'utf8')
    assert.match(src, /value="bookmarked"/)
    const content = readFileSync(new URL('./UsageTabContent.tsx', import.meta.url), 'utf8')
    assert.match(content, /usageBookmarkEmpty/)
  })
  it('has remaining toggle',()=>{
    const src = readFileSync(new URL('./UsageModeToggle.tsx', import.meta.url), 'utf8')
    assert.match(src, /role="switch"/)
    assert.match(src, /aria-checked=\{remaining\}/)
    assert.match(src, /w-auto min-w-20/)
    assert.match(src, /whitespace-nowrap/)
  })
  it('restores bookmarks from localStorage',()=>{
    const src = readFileSync(new URL('../app/useUsageBookmarks.ts', import.meta.url), 'utf8')
    assert.match(src, /biseo:usage-bookmarks/)
    assert.match(src, /parseUsageBookmarks/)
  })
  it('uses an adaptive bottom sheet below sm and a centered modal above',()=>{
    const modal = readFileSync(new URL('./Modal.tsx', import.meta.url), 'utf8')
    const shell = modal + readFileSync(new URL('./UsageModal.tsx', import.meta.url), 'utf8')
    assert.match(shell, /max-h-\[90dvh\]/)
    assert.match(shell, /rounded-t-lg/)
    assert.match(shell, /safe-area-inset-bottom/)
    assert.match(shell, /sm:max-w-4xl/)
    assert.match(shell, /sm:max-h-\[85vh\]/)
    assert.match(modal, /role="dialog"/)
    assert.match(modal, /aria-modal="true"/)
    assert.match(readFileSync(new URL('./UsageModal.tsx', import.meta.url), 'utf8'), /layout="adaptive"/)
    assert.match(readFileSync(new URL('./ModalCloseButton.tsx', import.meta.url), 'utf8'), /variant="ghost"/)
  })
})
