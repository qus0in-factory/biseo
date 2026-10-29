import test from'node:test'
import assert from'node:assert/strict'
import{mkdtemp,mkdir,symlink}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{findRollout}from'./codex-find.js'
test('skips a symlink in the date directory',async()=>{
 const root=await mkdtemp(join(tmpdir(),'codex-'));process.env.BISEO_CODEX_DIR=root
 const id='01a18109-e753-7930-8910-6ee2954dc3fc'
 await mkdir(join(root,'2026','10','28'),{recursive:true})
 await symlink('/etc/hosts',join(root,'2026','10','28',`rollout-x-${id}.jsonl`))
 assert.equal(await findRollout(id),null)
 delete process.env.BISEO_CODEX_DIR
})