import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { sanitizeSvg } from './sanitizeSvg.js'

describe('sanitizeSvg', () => {
  it('removes script tags', () => {
    const svg = '<svg><script>alert(1)</script><rect/></svg>'
    assert.doesNotMatch(sanitizeSvg(svg), /<script/i)
  })
  it('removes event handlers', () => {
    const svg = '<svg><rect onload="alert(1)" /></svg>'
    assert.doesNotMatch(sanitizeSvg(svg), /onload/i)
  })
  it('removes external hrefs', () => {
    const svg = '<svg><a href="https://evil.example/x"><text>x</text></a></svg>'
    assert.doesNotMatch(sanitizeSvg(svg), /https:\/\/evil/i)
  })
  it('removes javascript urls', () => {
    const svg = '<svg><a href="javascript:alert(1)"><text>x</text></a></svg>'
    assert.doesNotMatch(sanitizeSvg(svg), /javascript:/i)
  })
})
