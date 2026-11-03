import assert from'node:assert/strict'
import test from'node:test'
import{paneSnapshot}from'./pane-snapshot.js'
import{PaneLocks}from'./pane-locks.js'
import type{HerdrPort}from'./ports.js'

{
const pane={pane_id:'w:p1',tab_id:'t',workspace_id:'w',terminal_id:'m',agent_status:'idle' as const,agent:'opencode',revision:1}
const agent={pane_id:'w:p1',terminal_id:'m',agent_status:'idle' as const,agent:'opencode',name:'ds-o',revision:1}
test('paneSnapshot attaches the observed model and provider',async()=>{
 const h={listPanes:async()=>[pane],listAgents:async()=>[agent],readRecent:async()=>['Build auto · DeepSeek V4.1 Flash Ollama Cloud · max']} as unknown as HerdrPort
 const s=await paneSnapshot(h,new PaneLocks(),'w')
 assert.equal(s.panes[0].modelId,'deepseek-v4.1-flash')
 assert.equal(s.panes[0].modelProvider,'ollama')
})
}
