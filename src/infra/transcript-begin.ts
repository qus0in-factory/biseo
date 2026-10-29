import{antigravityResponse as agy}from'../domain/antigravity-response.js'
import{claudeResponse as claude}from'../domain/claude-response.js'
import{codexResponse as codex}from'../domain/codex-response.js'
import type{AgentSession}from'../domain/herdr.js'
import type{CaptureReader}from'../app/ports.js'
import{readNew,sizeOf}from'./transcript-io.js'
import{sessionPath}from'./transcript-path.js'
import{readTranscript}from'./transcript-read.js'
import{userSeen}from'./transcript-confirm.js'
export async function beginTranscript(s:AgentSession,cwd:string|undefined,prompt:string):Promise<CaptureReader|null>{
 const path=await sessionPath(s,cwd)
 if(!path)return null
 const parse=s.source==='herdr:claude'?claude:s.source.endsWith(':codex')?codex:agy
 const offset=await sizeOf(path)
 return{
  read:ms=>readTranscript(path,offset,parse,prompt,ms),
  confirm:async()=>userSeen(await readNew(path,offset),prompt,s.source),
 }
}
