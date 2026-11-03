import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('workspace tabs stay on one horizontally scrollable line', () => {
 const css = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
 assert.match(css('./workspace-switcher.css'), /\.workspace-switcher \{[^}]*display: flex;/)
 assert.match(css('./workspace-switcher.css'), /\.workspace-tabs \{[^}]*display: flex;[^}]*overflow-x: auto;/)
 assert.match(css('./workspace-tab.css'), /\.workspace-tab \{[^}]*min-height: 44px;/)
})
