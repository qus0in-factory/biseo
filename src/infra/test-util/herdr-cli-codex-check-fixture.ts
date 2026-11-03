import assert from'node:assert/strict'
export function checkHerdrCli(ps:any,as:any,pane:any,agent:any){
 assert.deepEqual(ps[0].agent_session,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
 assert.equal(ps[1].agent_session?.source,'herdr:claude')
 assert.equal(ps[2].agent_session?.value,'old')
 assert.equal(ps[3].agent_session,undefined)
 assert.deepEqual(as[0].agent_session,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
 assert.deepEqual(pane,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
 assert.deepEqual(agent,{agent:'codex',kind:'id',source:'biseo:codex',value:'s1'})
}
