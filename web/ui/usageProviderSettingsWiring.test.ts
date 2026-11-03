import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const src = (f: string): string => readFileSync(new URL(f, import.meta.url), 'utf8')

test('provider settings reuses the shared sortable list and resources hint', () => {
  const list = src('./UsageProviderSettingsList.tsx')
  assert.match(list, /<SortableList/)
  assert.match(list, /<SortableItem/)
  assert.match(src('./UsageProviderSettingsHeader.tsx'), /usageProviderSettingsHint/)
})
