import{mkdir,mkdtemp,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{rec,key}from'./codex-session-record-fixture.js'
import{fakePs,env}from'./codex-session-env-fixture.js'
export async function setupRead(){
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),file=join(root,'2026','rollout.jsonl')
 const old=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 await mkdir(join(root,'2026'),{recursive:true});await writeFile(file,'{}');await env(base,root);await fakePs(base)
 await writeFile(join(base,'state','codex',key('w:p1')+'.json'),rec('s1',file))
 return{base,root,file,old}
}
