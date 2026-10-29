import test from'node:test'
import assert from'node:assert/strict'
import{mkdtemp,mkdir,writeFile,symlink}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{findRollout}from'./codex-find.js'
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