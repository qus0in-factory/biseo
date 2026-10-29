import {readdir}from'node:fs/promises'
import {homedir}from'node:os'
import {join}from'node:path'
import type{AgentSession}from'../domain/herdr.js'
import {valid}from'./codex-state.js'
export function stateDir(){return join(process.env.BISEO_STATE_DIR??join(homedir(),'.local','state','biseo'),'codex')}
export function statePath(pane:string){return join(stateDir(),Buffer.from(pane,'utf8').toString('hex')+'.json')}
export async function readCodexSession(pane:string):Promise<AgentSession|null>{
 const r=await valid(statePath(pane))
 return r?{agent:'codex',kind:'id',source:'biseo:codex',value:r.session_id}:null
}
export async function codexTranscriptPath(value:string):Promise<string|null>{
 for(const f of await readdir(stateDir()).catch(()=>[])){
  const r=await valid(join(stateDir(),f))
  if(r?.session_id===value)return r.transcript_path
 }
 return null
}
