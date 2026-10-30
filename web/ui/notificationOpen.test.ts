import assert from 'node:assert/strict'
import test from 'node:test'
import { readFileSync } from 'node:fs'

const src = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')

test('opening a notification navigates, closes and dismisses it', () => {
  const modal = src('./NotificationModal.tsx')
  assert.match(modal, /navigate\(`\/chat\/\$\{item\.paneId\}`\)/)
  assert.match(modal, /onClose\(\)/)
  assert.match(modal, /dismiss\(item\.id\)/)
  assert.match(src('../app/useNotificationSeen.ts'), /dismissSeen\(paneId/)
  assert.match(src('../app/useWorkspaceNotify.ts'), /useTabVisible\(\)/)
})
