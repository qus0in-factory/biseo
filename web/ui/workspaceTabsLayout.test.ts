import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('workspace tabs stay on one borderless scrollable line', () => {
 const css = (f: string) => readFileSync(new URL(f, import.meta.url), 'utf8')
 const switcher = css('./workspace-switcher.css')
 const tab = css('./workspace-tab.css')
 assert.match(switcher, /\.workspace-switcher \{[^}]*display: flex;/)
 assert.doesNotMatch(switcher, /\.workspace-switcher \{[^}]*border:/)
 assert.match(switcher, /\.workspace-tabs \{[^}]*display: flex;[^}]*overflow-x: auto;/)
 assert.match(tab, /\.workspace-tab \{[^}]*min-height: 44px;/)
 assert.match(tab, /\.workspace-tab \{[^}]*background: transparent;/)
 assert.doesNotMatch(tab, /\.workspace-tab:hover \{[^}]*border/)
 assert.match(tab, /\.workspace-tab-current::after \{[^}]*height: 2px;[^}]*background: var\(--foreground\);/)
 assert.doesNotMatch(tab, /\.workspace-tab-current \{[^}]*background:/)
})
