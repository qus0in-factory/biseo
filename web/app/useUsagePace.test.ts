import test from 'node:test'
import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { useUsagePace } from './useUsagePace'
import { stubGlobal } from '../test-util/stubGlobal'
import r from '../resources.json'

function initialSettings() {
  let settings!: ReturnType<typeof useUsagePace>['settings']
  function Probe() { settings = useUsagePace().settings; return null }
  renderToStaticMarkup(createElement(Probe))
  return settings
}

test('pace hook reads the configured storage key on initialization, without running effects', t => {
  const keys: string[] = []
  stubGlobal(t, 'window', { localStorage: {
    getItem(key: string) { keys.push(key); return '{"w":false,"m":true}' },
    setItem() { assert.fail('SSR must not execute persistence effects') },
  } })
  assert.deepEqual(initialSettings(), { w: false, m: true })
  assert.deepEqual(keys, [r.usagePaceStorageKey])
})

test('pace hook uses defaults without a browser', t => {
  stubGlobal(t, 'window', undefined)
  assert.deepEqual(initialSettings(), { w: true, m: true })
})

test('pace hook falls back when the storage property or getItem throws', t => {
  let denyProperty = true
  stubGlobal(t, 'window', { get localStorage() {
    if (denyProperty) throw new Error('denied')
    return { getItem() { throw new Error('denied') } }
  } })
  assert.deepEqual(initialSettings(), { w: true, m: true })
  denyProperty = false
  assert.deepEqual(initialSettings(), { w: true, m: true })
})
