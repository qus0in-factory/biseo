import {antigravityResponse}from'../domain/antigravity-response.js'
import {claudeResponse}from'../domain/claude-response.js'
import type{CapturePort}from'../app/ports.js'
import {readNew,sizeOf,waitChange}from'./transcript-io.js'
import {sessionPath}from'./transcript-path.js'
export function createCapture():CapturePort{
 return {begin:async(session,cwd,prompt)=>{
  if(!session)return null
  const path=await sessionPath(session,cwd)
  if(!path)return null
  const parse=session.source==='herdr:claude'?claudeResponse:antigravityResponse
  const offset=await sizeOf(path)
  return {read:async(graceMs)=>{
   const end=Date.now()+graceMs
   for(;;){
    const text=parse(await readNew(path,offset),prompt)
    if(text)return text
    if(Date.now()>=end)return null
    await waitChange(path,end-Date.now())
   }
  }}
 }}
}
