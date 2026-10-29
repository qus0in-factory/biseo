import {readdir,stat}from'node:fs/promises'
import {homedir}from'node:os'
import {join}from'node:path'
import type{AgentSession}from'../domain/herdr.js'
import {codexPath}from'./codex-find.js'
const id=/^[A-Za-z0-9_-]+$/
export async function sessionPath(s:AgentSession,c?:string){
 if(!id.test(s.value))return null
 if(s.source.endsWith(':codex'))return codexPath(s)
 if(s.source==='herdr:claude'){
  const b=process.env.BISEO_CLAUDE_DIR??join(homedir(),'.claude','projects')
  return c?.startsWith('/')?join(b,c.replace(/[^a-zA-Z0-9]/g,'-'),s.value+'.jsonl'):go(b,s.value)
 }
 if(s.source==='herdr:antigravity_cli'){
  const b=process.env.BISEO_ANTIGRAVITY_DIR??join(homedir(),'.gemini','antigravity-cli','brain')
  return join(b,s.value,'.system_generated','logs','transcript_full.jsonl')
 }
 return null
}
async function go(b:string,v:string){for(const d of await readdir(b).catch(()=>[])){const p=join(b,d,v+'.jsonl');if(await stat(p).then(x=>x.isFile(),()=>0))return p}return null}
