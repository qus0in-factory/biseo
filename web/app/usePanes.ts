import{useState,useCallback}from'react'
import type{WorkspaceApiPort as Api}from'../domain/ports'
import type{PaneSummary}from'../domain/timeline'
import{dataOf,loadingState}from'../domain/asyncState'
import type{AsyncState}from'../domain/asyncState'
import{paneListState,paneOfflineState}from'./paneAsyncState'
export function usePanes(api:Api,wsId:string|null){
 const[state,setState]=useState<AsyncState<PaneSummary[]>>(()=>loadingState())
 const reload=useCallback(async()=>{
  if(!wsId)return
  setState(s=>loadingState(s))
  try{setState(paneListState(await api.getPanes(wsId)))}
  catch{setState(s=>paneOfflineState(s))}
 },[api,wsId])
 const setSnapshot=useCallback((l:PaneSummary[])=>setState(paneListState(l)),[])
 const markDisconnected=useCallback(()=>setState(s=>paneOfflineState(s)),[])
 return{panes:dataOf(state)??[],panesState:state,panesRetry:reload,loading:state.status==='loading',error:state.status==='error'?state.error:null,reload,setSnapshot,markDisconnected}
}
