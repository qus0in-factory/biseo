import{useEffect,useRef}from'react'
import type{WorkspaceApiPort as P}from'../domain/ports'
import{listState}from'../domain/asyncListState'
import{useTimelinePager}from'./useTimelinePager'
import{useTimelineReload}from'./useTimelineReload'
import{useTimelineOlder}from'./useTimelineOlder'
import{useAsyncPhase}from'./useAsyncPhase'
export function useTimelinePages(p:P,w:string|null,paneId:string|null){
 const{paging,setPaging,ref,update,setItems,reset}=useTimelinePager(paneId)
 const phase=useAsyncPhase(),gen=useRef(0)
 const reload=useTimelineReload(p,w,paneId,setPaging,gen,phase.start,phase.done)
 const older=useTimelineOlder(p,w,paneId,ref,setPaging,gen)
 useEffect(()=>{
  gen.current++
  reset()
  phase.resetPhase(!!paneId)
  void reload()
 },[paneId,reset,reload,phase.resetPhase])
 return{items:paging.items,timelineState:listState(paging.items,phase.loading,phase.error),hasMore:paging.hasMore,update,setItems,reload,...older}
}
