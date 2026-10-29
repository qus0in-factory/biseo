import{mkdir,mkdtemp,symlink,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{fakePs,env}from'./codex-session-env-fixture.js'
let lastOld:any
export async function setupSymlinkEnv(){
 const base=await mkdtemp(join(tmpdir(),'biseo-codex-')),root=join(base,'sessions'),link=join(root,'link.jsonl'),dot=join(root,'..rollout.jsonl')
 lastOld=[process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 await mkdir(root,{recursive:true});await writeFile(dot,'{}');await symlink('/etc/hosts',link);await env(base,root);await fakePs(base)
 return{base}
}
export function restoreSymlinkEnv(){const o=lastOld;if(o[0]===undefined)delete process.env.BISEO_STATE_DIR;else process.env.BISEO_STATE_DIR=o[0];if(o[1]===undefined)delete process.env.BISEO_CODEX_DIR;else process.env.BISEO_CODEX_DIR=o[1];if(o[2]===undefined)delete process.env.PATH;else process.env.PATH=o[2]}
