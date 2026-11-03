import test from'node:test'
import assert from'node:assert/strict'
import{createFakeD1}from '../test-util/fake-d1.js'
import{importRecent}from'../app/import-recent.js'
test('recent import deduplicates normal turns and repeated pulls within owner/workspace',async()=>{
 const db=createFakeD1()
 const recent={key:'a',promptText:'hi',responseText:'done',targetName:'pane',agentKind:'codex'}
 assert.equal(await importRecent(db,recent,'w','p','owner'),true)
 assert.equal(await importRecent(db,recent,'w','p','owner'),false)
 await db.prepare("UPDATE timeline_turns SET request_id='normal-turn'").run()
 assert.equal(await importRecent(db,{...recent,key:'b'},'w','p','owner'),false)
 assert.equal(await importRecent(db,{...recent,key:'c'},'other','p','owner'),true)
 assert.equal(await importRecent(db,{...recent,key:'d'},'w','p','other'),true)
 const row=await db.prepare('SELECT status,response_text FROM timeline_turns LIMIT 1').first()
 assert.deepEqual(row,{status:'completed',response_text:'done'})
})
