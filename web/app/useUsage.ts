import{useCallback,useState}from'react'
import type{UsageApiPort,UsageProvider}from'../domain/usage'
import{dataOf}from'../domain/asyncState'
import{loadUsage}from'./usageLoad'
import{useUsageStore}from'./useUsageStore'
import{useUsageState}from'./useUsageState'
import{useUsageInterval}from'./useUsageInterval'
export function useUsage(api:UsageApiPort,enabled:boolean){
 const[state,setState]=useUsageState()
 const[stale,setStale]=useState(false)
 const[last,setLast]=useState<string|null>(null)
 const setUsageData=useUsageStore(s=>s.setUsageData)
 const load=useCallback(async()=>{
  const r=await loadUsage(api,live,setState)
  if(!r)return
  setStale(!!r.stale)
  setLast(r.lastSuccessAt??null)
  setUsageData(r.providers??[],!!r.stale,r.lastSuccessAt??null)
 },[api,setUsageData])
 const live=useUsageInterval(enabled,load)
 const error=state.status==='error'?state.error:null
 return{providers:dataOf(state)??[],stale,lastSuccessAt:last,error,state,retry:load}
}
