import {readdir,stat}from'node:fs/promises'
import {homedir}from'node:os'
import {join}from'node:path'
import type{AgentSession}from'../domain/herdr.js'
const id=/^[A-Za-z0-9_-]+$/
export async function sessionPath(s:AgentSession,cwd?:string):Promise<string|null>{
 if(!id.test(s.value))return null
 if(s.source==='herdr:claude'){
  const base=process.env.BISEO_CLAUDE_DIR??join(homedir(),'.claude','projects')
  if(cwd?.startsWith('/'))return join(base,cwd.replace(/[^a-zA-Z0-9]/g,'-'),`${s.value}.jsonl`)
  return scan(base,s.value)
 }
 if(s.source==='herdr:antigravity_cli'){
  const base=process.env.BISEO_ANTIGRAVITY_DIR??join(homedir(),'.gemini','antigravity-cli','brain')
  return join(base,s.value,'.system_generated','logs','transcript_full.jsonl')
 }
 return null
}
async function scan(base:string,value:string):Promise<string|null>{
 for(const d of await readdir(base).catch(()=>[])){
  const p=join(base,d,`${value}.jsonl`)
  if(await stat(p).then(x=>x.isFile()).catch(()=>false))return p
 }
 return null
}
