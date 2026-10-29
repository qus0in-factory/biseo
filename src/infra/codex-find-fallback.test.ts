import test from'node:test'
import assert from'node:assert/strict'
import{mkdtemp,mkdir,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{findRollout}from'./codex-find.js'
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