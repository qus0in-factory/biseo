import{readFile}from'node:fs/promises'
import type{AgentSession}from'../domain/herdr.js'
import{sessionPath}from'./transcript-path.js'
import{recentWindow}from'../domain/recent-window.js'
import{claudeResponse}from'../domain/claude-response.js'
import{codexResponse}from'../domain/codex-response.js'
import{antigravityResponse}from'../domain/antigravity-response.js'
export async function recentTranscript(session:AgentSession,cwd?:string){
 const path=await sessionPath(session,cwd)
 if(!path)return null
 const raw=await readFile(path,'utf8').catch(error=>{
  if(error.code==='ENOENT')return null
  throw error
 })
 if(raw===null)return null
 const window=recentWindow(raw,session.source)
 if(!window)return null
 const promptText=window.prompt
 const parse=session.source==='herdr:claude'?claudeResponse:session.source.endsWith(':codex')?codexResponse:antigravityResponse
 const responseText=parse(window.raw,promptText)
 return responseText?{promptText,responseText}:null
}
