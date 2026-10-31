import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

describe('HeaderTabs spacing', () => {
  it('wraps within the header and keeps 44px touch targets', () => {
    const src = readFileSync(new URL('./HeaderTabs.tsx', import.meta.url), 'utf8')
    assert.match(src, /TabsList className="max-w-full gap-2"/)
    assert.match(src, /TabsTrigger value="usage" className="shrink-0 gap-2"/)
    assert.doesNotMatch(src, /value="notify"/)
    const header = readFileSync(new URL('./DashboardHeader.tsx', import.meta.url), 'utf8')
    assert.match(header, /UsageModal open=\{tab === 'usage'\}/)
    assert.doesNotMatch(header, /NotificationModal/)
    const tabs = readFileSync(new URL('../components/ui/tabs.tsx', import.meta.url), 'utf8')
    assert.match(tabs, /min-h-11 flex-wrap/)
  })
})
