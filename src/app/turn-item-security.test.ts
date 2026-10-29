import test from'node:test'
import assert from'node:assert/strict'
import {makeItem}from'./turn-item.js'
import type{TurnInput}from'./turn-input.js'
import type{Target}from'../domain/turn-policy.js'
test('turn item targetName does not expose terminal title',()=>{
 const pane={pane_id:'p9',tab_id:'t',workspace_id:'w',terminal_id:'x',agent_status:'idle',agent:'codex',title:'secret cmd',terminal_title_stripped:'secret cmd',revision:1}
 const it=makeItem({requestId:'r',workspaceId:'w',paneId:'p9',text:'hi'} as TurnInput,{pane,agent:null} as unknown as Target,1)
 assert.equal(it.targetName,'p9')
})
