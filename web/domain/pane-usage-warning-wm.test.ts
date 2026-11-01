import assert from'node:assert/strict'
import test from'node:test'
import{evaluatePaneUsageWarning}from'./pane-usage-warning'
import{makeTestPane}from'./pane-usage-test-helper'
const w=(window:string,u:number)=>[{provider:'codex',state:'available' as const,windows:[{window,usedPercent:u,resetsAt:null,checkedAt:null,limitReached:false,source:null}]}]
test('weekly and monthly boundaries 98% and unknown window ignored',()=>{
 for(const k of['secondary','w','monthly','m']){
  assert.equal(evaluatePaneUsageWarning(makeTestPane('codex','sol'),w(k,97.9)).hasWarning,false)
  assert.equal(evaluatePaneUsageWarning(makeTestPane('codex','sol'),w(k,98)).hasWarning,true)
 }
 assert.equal(evaluatePaneUsageWarning(makeTestPane('codex','sol'),w('unknown',100)).isUnknown,true)
})
