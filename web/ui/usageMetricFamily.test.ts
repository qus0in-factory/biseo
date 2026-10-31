import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import r from'../resources.json'
import{UsageMetricRow}from'./UsageMetricRow.js'
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
