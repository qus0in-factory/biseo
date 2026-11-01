import{useCallback,useRef}from'react'
import{loadHealth,type HealthResult}from'../domain/healthRetry'
import type{HealthPort}from'../domain/auth'
import config from'../../config/session.json'

export function useHealthRequest(port:HealthPort){
 const seq=useRef(0),live=useRef<AbortController|null>(null)
 const run=useCallback(async():Promise<HealthResult|null>=>{
  const id=++seq.current,c=new AbortController()
  live.current?.abort();live.current=c
  const x=await loadHealth(port,c.signal,config.healthRetryDelaysMs)
  if(id!==seq.current)return null
  live.current=null
  return x
 },[port])
 const abort=useCallback(()=>{
  seq.current++
  live.current?.abort()
  live.current=null
 },[])
 return{run,abort}
}
