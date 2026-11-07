import assert from'node:assert/strict'
import test from'node:test'
import{createAutoLabeler}from'./auto-label.js'
import type{HerdrPort}from'./ports.js'
import type{PaneInfo}from'../domain/herdr.js'
test('shares tab lookup within a pass and refreshes next pass',async()=>{
 const reads:string[]=[],renames:string[]=[]
 let named=true
 const h={getTab:async(id:string)=>{reads.push(id);return{label:named?'user':null}},
  renamePane:async(id:string)=>{renames.push(id)}}as unknown as HerdrPort
 const panes=['a','b','c'].map(id=>({pane_id:id,tab_id:id==='c'?'other':'shared'}as PaneInfo))
 const models=Object.fromEntries(panes.map(p=>[p.pane_id,{provider:'claude',modelId:'sonnet'}]))
 const label=createAutoLabeler([{provider:'claude',model:'sonnet',alias:'son'}])
 await label(h,panes,models)
 assert.deepEqual(reads,['shared','other'])
 assert.deepEqual(renames,[])
 named=false
 await label(h,panes,models)
 assert.deepEqual(reads,['shared','other','shared','other'])
 assert.deepEqual(renames,['a','b','c'])
})
