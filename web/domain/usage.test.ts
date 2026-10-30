import assert from'node:assert/strict'
import test from'node:test'
import{usagePercentText,usageWindowName}from'./usage.js'
import r from'../resources.json'
const l=r as Record<string,string>
const eq:(a:unknown,b:unknown)=>void=assert.equal
test('percent',()=>{
eq(usagePercentText(42,'unknown'),'42%')
eq(usagePercentText(0,'unknown'),'0%')
eq(usagePercentText(null,'unknown'),'unknown')})
test('periods',()=>{
const t:[string,string,string][]=[['codex','primary','5h'],['codex','secondary','w'],
['claude','primary','5h'],['claude','secondary','w'],['agy','primary','5h'],['agy','secondary','w'],
['opencode-go','primary','5h'],['opencode-go','secondary','w'],['opencode-go','monthly','m'],
['grok','primary','m'],['ollama','primary','m']]
for(const[p,w,v]of t)eq(usageWindowName(p,w,l),v)})
test('fallback',()=>{
eq(usageWindowName('codex','primary',{}),'primary')
eq(usageWindowName('opencode-free','primary',l),'primary')
eq(usageWindowName('opencode-go','monthly',{}),'monthly')})
