import test from'node:test'
import assert from'node:assert/strict'
import{isFirstSession,isOpencodeSession}from'./first-session.js'
import type{Target}from'./turn-policy.js'
const pane={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'term',agent_status:'idle' as const,agent:'opencode',revision:1}
const ag=(a:string,s:any)=>({pane_id:'w:p1',terminal_id:'term',agent_status:'idle' as const,agent:a,agent_session:s,revision:1})
const ses={source:'herdr:opencode',agent:'opencode',kind:'id' as const,value:'ses_1'}
test('only opencode without session is first session',()=>{
 const t:Target={pane,agent:ag('opencode',undefined)}
 assert.equal(isFirstSession(t),true)
 assert.equal(isFirstSession({pane}),true)
 const c:Target={pane:{...pane,agent:'claude'},agent:ag('claude',undefined)}
 assert.equal(isFirstSession(c),false)
 const e:Target={pane,agent:ag('opencode',ses)}
 assert.equal(isFirstSession(e),false)
 assert.equal(isOpencodeSession(ses),true)
 assert.equal(isOpencodeSession(undefined),false)
})
