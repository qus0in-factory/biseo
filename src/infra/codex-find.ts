import{readdir,lstat}from'node:fs/promises'
import{homedir}from'node:os'
import{join}from'node:path'
import type{AgentSession}from'../domain/herdr.js'
import{codexTranscriptPath}from'./codex-session.js'
import{inDateDirs}from'./codex-date.js'
const uuid=/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/
export async function findRollout(id:string):Promise<string|null>{
 if(!uuid.test(id))return null
 const root=process.env.BISEO_CODEX_DIR??join(homedir(),'.codex','sessions')
 const hit=await inDateDirs(root,id)
 if(hit)return hit
 const want=`-${id}.jsonl`
 const names=await readdir(root,{recursive:true}).catch(()=>[] as string[])
 for(const n of names.filter(n=>n.endsWith(want)).sort().reverse()){
  const p=join(root,n)
  if(await lstat(p).then(s=>s.isFile()).catch(()=>false))return p
 }
 return null
}
export const codexPath=(s:AgentSession)=>s.source==='biseo:codex'?codexTranscriptPath(s.value):findRollout(s.value)
