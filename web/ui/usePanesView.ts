import { useEffect, useRef } from 'react'
import type { PaneSummary } from '../domain/timeline'
import {partitionPanes,togglePinnedPane} from '../domain/pinnedPanes'
import {usePinnedPanes as u} from './usePinnedPanes'
import r from '../resources.json'
export function usePanesView({panes,selectedId,storageKey}:{panes:PaneSummary[];selectedId:string|null;storageKey?:string}){
  const key=storageKey??r.pinnedStorageKey
  const {pinned,updatePinned}=u(panes,key)
  const {pinned:pinnedPanes,rest}=partitionPanes(panes,pinned)
  const refs=useRef(new Map<string,HTMLLIElement>())
  useEffect(()=>{if(!selectedId)return;refs.current.get(selectedId)?.scrollIntoView({block:'nearest',behavior:'smooth'})},[selectedId])
  if(!panes.length)return null
  const register=(paneId:string)=>(element:HTMLLIElement|null)=>{if(element)refs.current.set(paneId,element);else refs.current.delete(paneId)}
  const toggle=(paneId:string)=>updatePinned(togglePinnedPane(pinned,paneId))
  return {pinnedPanes,rest,pinned,toggle,register}
}