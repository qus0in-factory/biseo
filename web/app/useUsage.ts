import{useCallback,useEffect,useRef,useState}from'react'
import type{UsageApiPort,UsageProvider}from'../domain/usage'
import{dataOf,loadingState}from'../domain/asyncState'
import type{AsyncState}from'../domain/asyncState'
import{loadUsage}from'./usageLoad'
export function useUsage(api:UsageApiPort,enabled:boolean){
 const[state,setState]=useState<AsyncState<UsageProvider[]>>(()=>loadingState())
 const[stale,setStale]=useState(false)
 const[last,setLast]=useState<string|null>(null)
 const live=useRef(true)
 const load=useCallback(async()=>{
  const r=await loadUsage(api,live,setState)
  if(!r)return
  setStale(!!r.stale)
  setLast(r.lastSuccessAt??null)
 },[api])
 useEffect(()=>{
  if(!enabled)return
  live.current=true
  void load()
  const t=setInterval(()=>void load(),60000)
  return()=>{live.current=false;clearInterval(t)}
 },[enabled,load])
 const error=state.status==='error'?state.error:null
 return{providers:dataOf(state)??[],stale,lastSuccessAt:last,error,state,retry:load}
}
