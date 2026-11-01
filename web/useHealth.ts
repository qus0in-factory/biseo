import{useState,useEffect,useCallback}from'react'
import{useHealthRequest}from'./app/useHealthRequest'
import{bindHealthLifecycle}from'./infra/healthLifecycle'
import type{Health,HealthPort}from'./domain/auth'
import r from'./resources.json'

export function useHealth(port:HealthPort,on:boolean,expire:()=>void){
 const[data,setData]=useState<Health|null>(null)
 const[loading,setLoading]=useState(false)
 const{run,abort}=useHealthRequest(port)
 const check=useCallback(async()=>{
  if(!on)return
  setLoading(true)
  const x=await run()
  if(!x)return
  if(x.status==='ok')setData(x.data)
  else if(x.status==='auth')expire()
  else if(x.status==='failed')setData({error:r.unknown})
  setLoading(false)
 },[on,run,expire])
 useEffect(()=>{
  if(!on)return
  check()
  const off=bindHealthLifecycle({check,abort})
  return()=>{abort();off()}
 },[check,on,abort])
 return{data,loading,check}
}
