import assert from'node:assert/strict'
import test from'node:test'
import{usageModelFamilyKey,usageModelFamilyName}from'./usage-model-family.js'
import r from'../resources.json'
const res=r as Record<string,string>
const eq:(a:unknown,b:unknown)=>void=assert.equal
const G='gemini:Gemini Models:gemini-5h'
test('the agy id head carries the family key',()=>{
eq(usageModelFamilyKey('agy',G),'gemini')
eq(usageModelFamilyName('agy',G,res),res.usageModelFamily_gemini)})
test('a two-family pool keeps its own label',()=>{
eq(usageModelFamilyName('agy','claude-gpt:Pool:3p-weekly',res),res['usageModelFamily_claude-gpt'])})
test('an undetected family falls back to unknown',()=>{
eq(usageModelFamilyName('agy','unknown:Pool:weekly',res),res.usageModelFamily_unknown)
eq(usageModelFamilyName('agy','mystery:Pool:weekly',res),res.usageModelFamily_unknown)})
test('other providers never show a model family',()=>{
eq(usageModelFamilyKey('claude','five_hour'),'')
eq(usageModelFamilyName('claude','five_hour',res),'')})
