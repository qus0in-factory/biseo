import type{CapturePort}from'../app/ports.js'
import{beginOpencode}from'./opencode-capture.js'
import{beginTranscript}from'./transcript-begin.js'
export function createCapture():CapturePort{
 return{begin:async(s,cwd,prompt)=>{
  if(!s)return null
  if(s.source==='herdr:opencode')return beginOpencode(s.value,prompt)
  return beginTranscript(s,cwd,prompt)
 }}
}
