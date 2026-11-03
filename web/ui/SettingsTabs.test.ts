import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { SettingsTabs } from './SettingsTabs'

test('settings separates security, workspace and panel management', () => {
 for (const tab of ['security', 'workspace', 'panels']) {
  const html = renderToStaticMarkup(createElement(SettingsTabs, {tab, setTab() {}, onAdd() {}}))
  assert.equal((html.match(/role="tab"/g) ?? []).length, 3)
  assert.equal((html.match(/role="tabpanel"/g) ?? []).length, 1)
  assert.doesNotMatch(html, /<select/)
  assert.equal(html.includes('패널 추가'), tab === 'panels')
 }
})
