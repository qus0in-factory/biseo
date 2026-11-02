import{create}from'zustand'
import{connectionStatus,type ConnectionStatus}from'../domain/connectionStatus'
import{parsePinnedPanes}from'../domain/pinnedPanes'
import r from'../resources.json'

const init=()=>{
 try{return typeof window<'u'?parsePinnedPanes(localStorage.getItem(r.pinnedStorageKey)):[]}
 catch{return[]}
}

export interface UiState{
 drawerOpen:boolean
 selectedPaneId:string|null
 pinned:string[]
 connection:ConnectionStatus
 setDrawerOpen:(v:boolean)=>void
 toggleDrawer:()=>void
 setSelectedPaneId:(id:string|null)=>void
 setPinned:(ids:string[])=>void
 setOnline:(ok:boolean)=>void
}

export const useUiStore=create<UiState>(set=>({
 drawerOpen:false,
 selectedPaneId:null,
 pinned:init(),
 connection:'connecting',
 setDrawerOpen:drawerOpen=>set({drawerOpen}),
 toggleDrawer:()=>set(s=>({drawerOpen:!s.drawerOpen})),
 setSelectedPaneId:selectedPaneId=>set({selectedPaneId}),
 setPinned:pinned=>set({pinned}),
 setOnline:ok=>set(s=>({connection:connectionStatus(ok,s.connection==='connected')})),
}))
