import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { Pencil } from 'lucide-react'
import { SettingsAction } from './SettingsAction'
import r from '../resources.json'

test('icon actions retain accessible labels and hover descriptions', () => {
 const html = renderToStaticMarkup(createElement(SettingsAction, {
  icon: Pencil, iconOnly: true, children: r.renamePane,
 }))
 assert.ok(html.includes(`aria-label="${r.renamePane}"`))
 assert.ok(html.includes(`title="${r.renamePane}"`))
 assert.doesNotMatch(html, new RegExp(`>${r.renamePane}<`))
})
