import{useEffect,useRef,useState,useCallback}from'react'
import type{WorkspaceApiPort as Api}from'../domain/ports'
import type{PaneSummary}from'../domain/timeline'
import{dataOf,loadingState}from'../domain/asyncState'
import{paneListState,paneOfflineState}from'./paneAsyncState'
export function usePanes(api:Api,wsId:string|null){
 const[s,setS]=useState(()=>loadingState<PaneSummary[]>())
 const g=useRef(0)
 useEffect(()=>{g.current++;setS(loadingState())},[wsId])
 const reload=useCallback(async()=>{
  if(!wsId)return
  const n=++g.current
  setS(x=>loadingState(x))
  try{const l=await api.getPanes(wsId);if(n!==g.current)return;setS(paneListState(l))}
  catch{if(n!==g.current)return;setS(x=>paneOfflineState(x))}
 },[api,wsId])
 const snap=useCallback((l:PaneSummary[])=>setS(paneListState(l)),[])
 const off=useCallback(()=>setS(x=>paneOfflineState(x)),[])
 return{panes:dataOf(s)??[],panesState:s,panesRetry:reload,reload,setSnapshot:snap,markDisconnected:off}
}
