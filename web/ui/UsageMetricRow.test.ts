import { test } from 'node:test'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import r from '../resources.json'
import { UsageMetricRow } from './UsageMetricRow'
import { UsageWindowRow } from './UsageWindowRow'
import { percentMetric } from '../test-util/usageRowAssert'
import { fromNow } from '../test-util/usageRowAssert'
import { percentValue } from '../test-util/usageRowAssert'
import assert from 'node:assert/strict'
import { createElement as h } from 'react'
import { renderToStaticMarkup as render } from 'react-dom/server'
import { UsageModalDisplay } from './UsageModalDisplay'
import { expectNoTimeIcon } from '../test-util/usageTimeLeftExpect'
import { expectTimeIcon } from '../test-util/usageTimeLeftExpect'
import { metric } from '../test-util/usageOllamaFixture'

const label=(r as Record<string,string>).usageTimeLeft
test('metric time label appears only when a clock is available', () => {
  const withTime = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric: percentMetric(fromNow(3.5)) }))
  const withoutTime = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric: percentMetric(null) }))
  assert.ok(withTime.includes(`aria-label="${r.usageTimeLeft}"`))
  assert.ok(!withoutTime.includes(`aria-label="${r.usageTimeLeft}"`))
})

{
const res=r as Record<string,string>
const metric=(id:string)=>({id,label:'Pool - 5h',unit:'percent',
used:12,limit:100,remaining:88,resetsAt:null})
const html=(provider:string,id:string)=>renderToStaticMarkup(
  createElement(UsageMetricRow,{provider,metric:metric(id)}))
test('the agy row shows the model family next to the window',()=>{
const out=html('agy','gemini:Gemini Models:gemini-5h')
assert.match(out,new RegExp(res.usageModelFamily_gemini))
assert.match(out,/5h/)})
test('a pool without a detected family shows unknown',()=>{
assert.match(html('agy','mystery:Pool:weekly'),new RegExp(res.usageModelFamily_unknown))})
test('other providers keep the plain window label',()=>{
assert.doesNotMatch(html('claude','five_hour'),new RegExp(res.usageModelFamily_gemini))})
}
test('unknown metric values label the schedule as expected', () => {
  const original = Date.now
  Date.now = () => Date.parse('2026-11-03T00:00:00Z')
  try {
    const metric = {
      id: '5h', label: '5h', unit: 'percent' as const,
      used: null, limit: 100, remaining: null, resetsAt: '2026-11-03T02:00:00Z',
    }
    const html = render(h(UsageModalDisplay, { value: true }, h(UsageMetricRow, { provider: 'codex', metric })))
    assert.match(html, new RegExp(r.usageResetExpected))
    assert.match(html, /2시간 후/)
  } finally { Date.now = original }
})
{
const label=(r as Record<string,string>).usageTimeLeft
const html=(p:string,m:ReturnType<typeof metric>)=>renderToStaticMarkup(
 createElement(UsageMetricRow,{provider:p,metric:m}))
test('included balance is a monthly window',()=>{
 const m=metric('included_balance','currency',{used:0.5,limit:60,remaining:59.5,startsAt:fromNow(-15),resetsAt:fromNow(15)})
 expectTimeIcon(html('ollama',m),label,50)
})
test('purchased and currency rows keep no time column',()=>{
 const m=metric('purchased_balance','currency',{used:null,remaining:7,startsAt:fromNow(-15),resetsAt:fromNow(15)})
 expectNoTimeIcon(html('ollama',m),label)
 expectNoTimeIcon(html('claude',m),label)
})
}
test('both usage row types preserve the remaining value and label near a limit', () => {
  const metric = { ...percentMetric(null), used: 98, remaining: 2 }
  const value = { ...percentValue(null), usedPercent: 98 }
  for (const node of [createElement(UsageMetricRow, { provider: 'claude', metric }),
    createElement(UsageWindowRow, { provider: 'codex', value })]) {
    const out = renderToStaticMarkup(node)
    assert.match(out, /title="2%"/)
    assert.ok(out.includes(`>${r.usageWindow_secondary}<`))
  }
})

const res = r as Record<string, string>
const html = (m: ReturnType<typeof metric>) =>
  renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'ollama', metric: m, remaining: false }))

test('the used view shows the balance and remaining time for the included balance', () => {
  const m = metric('included_balance', 'currency', { used: 0.5, limit: 60, remaining: 59.5, startsAt: fromNow(-18), resetsAt: fromNow(12) })
  const out = html(m)
  assert.match(out, new RegExp(`${res.usageBalance} \\$59\\.50 \\(99%\\)`))
  expectTimeIcon(out, res.usageTimeLeft, 40)
  const p = metric('purchased_balance', 'currency', { used: null, remaining: 7 })
  expectNoTimeIcon(html(p), res.usageTimeLeft)
})
{
const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const label = (r as Record<string, string>).usageTimeLeft

test('w and m metric rows put remaining usage and remaining time side by side', () => {
  const metric = { id: 'seven_day', label: 'seven_day', unit: 'percent', used: 50, limit: 100, remaining: 50, resetsAt: fromNow(3.5) }
  const html = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  expectTimeIcon(html, label, 50)
})
}
{
const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const label = (r as Record<string, string>).usageTimeLeft

test('5h metric rows do not show a remaining time', () => {
  const metric = { id: 'five_hour', label: 'five_hour', unit: 'percent', used: 50, limit: 100, remaining: 50, resetsAt: fromNow(1) }
  const html = renderToStaticMarkup(createElement(UsageMetricRow, { provider: 'claude', metric }))
  expectNoTimeIcon(html, label)
})
}
{
const DAY = 86_400_000
const fromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString()
const left = (r as Record<string, string>).usageTimeLeft
const elapsed = (r as Record<string, string>).usageTimeElapsed

test('the used view shows elapsed time next to the used share', () => {
  const metric = { id: 'seven_day', label: 'seven_day', unit: 'percent', used: 70, limit: 100, remaining: 30, resetsAt: fromNow(5.25) }
  const html = renderToStaticMarkup(
    createElement(UsageMetricRow, { provider: 'claude', metric, remaining: false }),
  )
  assert.match(html, /70%/)
  expectTimeIcon(html, elapsed, 25)
  assert.doesNotMatch(html, new RegExp(`"${left}"`))
})
}
