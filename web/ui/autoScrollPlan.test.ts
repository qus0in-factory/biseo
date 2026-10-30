import test from 'node:test'
import assert from 'node:assert/strict'
import { planScroll } from './autoScrollPlan.js'
import { scrollItem } from '../domain/scrollItem-fixture.js'

test('an own send scrolls to bottom even while the user reads history', () => {
  const prev = [scrollItem('r1')]
  const next = [...prev, scrollItem('r2', 'queued', true)]
  assert.equal(planScroll(prev, next, false), 'bottom')
})

test('an incoming message only follows the bottom while the user stays there', () => {
  const prev = [scrollItem('r1')]
  const next = [...prev, scrollItem('r2')]
  assert.equal(planScroll(prev, next, true), 'bottom')
  assert.equal(planScroll(prev, next, false), 'jump')
})

test('an unchanged list does not move the view', () => {
  const prev = [scrollItem('r1')]
  assert.equal(planScroll(prev, prev, false), 'none')
})
