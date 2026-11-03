import test from 'node:test'
import assert from 'node:assert/strict'
import { Tabs } from './tabs'
import { Sheet } from './sheet'
import { Carousel } from './carousel'

test('mobile shadcn ui components export valid functions', () => {
  assert.equal(typeof Tabs, 'function')
  assert.equal(typeof Sheet, 'function')
  assert.equal(typeof Carousel, 'function')
})
