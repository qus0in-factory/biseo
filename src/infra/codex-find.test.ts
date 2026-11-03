import test from'node:test'
import assert from'node:assert/strict'
import{mkdtemp,mkdir,writeFile,symlink}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{findRollout}from'./codex-find.js'
import{mkdtemp,mkdir,writeFile}from'node:fs/promises'
import{createAvailability}from'./codex-availability.js'
import type{AgentSession}from'../domain/herdr.js'
import{id,linkId,dirId,setup,teardown}from'./codex-find-path-fixture.js'
import{mkdtemp,mkdir,symlink}from'node:fs/promises'

{
test('finds rollout by session id and skips symlinks',async()=>{
 const root=await mkdtemp(join(tmpdir(),'codex-'));process.env.BISEO_CODEX_DIR=root
 await mkdir(join(root,'2026','10','28'),{recursive:true})
 const f=join(root,'2026','10','28','rollout-x-01a18109-e753-7930-8910-6ee2954dc3fc.jsonl');await writeFile(f,'')
 await symlink('/etc/hosts',join(root,'2026','10','28','rollout-y-evil.jsonl'))
 assert.equal(await findRollout('01a18109-e753-7930-8910-6ee2954dc3fc'),f)
 assert.equal(await findRollout('evil'),null)
 assert.equal(await findRollout('none'),null)
 assert.equal(await findRollout('6ee2954dc3fc'),null)
 delete process.env.BISEO_CODEX_DIR
})
}
{
test('prefers the uuidv7 date directory and falls back for other ids',async()=>{
 const root=await mkdtemp(join(tmpdir(),'codex-'));process.env.BISEO_CODEX_DIR=root
 const v7='01a18109-e753-7930-8910-6ee2954dc3fc',f=join(root,'2026','10','28',`rollout-x-${v7}.jsonl`)
 const v4='00000000-0000-4000-8000-000000000000',g=join(root,'odd',`rollout-y-${v4}.jsonl`)
 await mkdir(join(root,'2026','10','28'),{recursive:true});await writeFile(f,'')
 await mkdir(join(root,'odd'),{recursive:true});await writeFile(g,'')
 assert.equal(await findRollout(v7),f)
 assert.equal(await findRollout(v4),g)
 delete process.env.BISEO_CODEX_DIR
})
}
{
test('rollout lookup requires a UUID and stays under the real root',async()=>{
 const c=await setup()
 try{
  assert.equal(await findRollout(id),c.file)
  assert.equal(await findRollout(linkId),null)
  assert.equal(await findRollout(dirId),null)
  assert.equal(await findRollout(`../${id}`),null)
  assert.equal(await findRollout(`${id}/../../etc/passwd`),null)
  const session:AgentSession={source:'herdr:codex',agent:'codex',kind:'id',value:linkId}
  assert.equal((await createAvailability().get(session,new Date('2026-10-29T10:00:00.000Z'))).state,'unknown')
  assert.equal((await createAvailability().get({...session,value:'../../etc/passwd'},new Date('2026-10-29T10:00:00.000Z'))).state,'unknown')
 }finally{await teardown(c)}
})
}
{
test('skips a symlink in the date directory',async()=>{
 const root=await mkdtemp(join(tmpdir(),'codex-'));process.env.BISEO_CODEX_DIR=root
 const id='01a18109-e753-7930-8910-6ee2954dc3fc'
 await mkdir(join(root,'2026','10','28'),{recursive:true})
 await symlink('/etc/hosts',join(root,'2026','10','28',`rollout-x-${id}.jsonl`))
 assert.equal(await findRollout(id),null)
 delete process.env.BISEO_CODEX_DIR
})
}
