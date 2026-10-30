import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('HeaderTabs spacing', () => {
  it('widens tab gap and keeps 44px touch target', () => {
    const src = readFileSync(new URL('./HeaderTabs.tsx', import.meta.url), 'utf8')
    assert.match(src, /TabsList className="gap-2"/)
    assert.match(src, /TabsTrigger value="usage" className="gap-2"/)
    assert.match(src, /TabsTrigger value="notify" className="gap-2"/)
  })
})