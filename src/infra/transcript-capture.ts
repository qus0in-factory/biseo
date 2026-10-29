import {antigravityResponse as agy}from'../domain/antigravity-response.js'
import {claudeResponse as claude}from'../domain/claude-response.js'
import {codexResponse as codex}from'../domain/codex-response.js'
import type{CapturePort}from'../app/ports.js'
import {beginOpencode}from'./opencode-capture.js'
import {readNew,sizeOf,waitChange}from'./transcript-io.js'
import {sessionPath}from'./transcript-path.js'
export function createCapture():CapturePort{
 return {begin:async(s,cwd,prompt)=>{
  if(!s)return null
  if(s.source==='herdr:opencode')return beginOpencode(s.value,prompt)
  const path=await sessionPath(s,cwd)
  if(!path)return null
  const parse=s.source==='herdr:claude'?claude:s.source.endsWith(':codex')?codex:agy
  const offset=await sizeOf(path)
  return {read:async(ms)=>{
   const end=Date.now()+ms
   for(;;){
    const text=parse(await readNew(path,offset),prompt)
    if(text)return text
    if(Date.now()>=end)return null
    await waitChange(path,end-Date.now())
   }
  }}
 }}
}
