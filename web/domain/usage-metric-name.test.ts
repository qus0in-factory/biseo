import assert from'node:assert/strict'
import test from'node:test'
import{usageMetricName}from'./usage-metric-name.js'
import r from'../resources.json'
const l=r as Record<string,string>
const eq:(a:unknown,b:unknown)=>void=assert.equal
const u=(i:string)=>usageMetricName('claude',i,'L',l)
const g=(i:string)=>usageMetricName('agy',i,'L',l)
test('claude source ids (UsageMetricRow path)',()=>{
eq(u('five_hour'),'5h')
for(const i of['seven_day','seven_day_opus','seven_day_sonnet','seven_day_oauth_apps','seven_day_cowork'])eq(u(i),'w')})
test('agy bucket suffix (UsageMetricRow path)',()=>{
eq(g('Default:3p-5h'),'5h')
eq(g('G:3p-weekly'),'w')
eq(g('G:weekly'),'w')
eq(g('G:gemini-argon-wtu-weekly'),'w')})
test('fallback keeps source label',()=>{
eq(g('G:gemini-daily'),'L')
eq(usageMetricName('codex','primary','primary',{}),'primary')
eq(usageMetricName('opencode-free','primary','primary',l),'primary')})
