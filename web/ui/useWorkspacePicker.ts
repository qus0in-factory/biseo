import{useEffect,useState}from'react'
import type{WorkspaceApiPort,WorkspaceSummary}from'../domain/ports'
export function useWorkspacePicker(api:WorkspaceApiPort){
 const [ws,setWs]=useState<WorkspaceSummary[]>([])
 const [cur,setCur]=useState<string|null>(null)
 const [ld,setLd]=useState(false)
 const [err,setErr]=useState<string|null>(null)
 const [note,setNote]=useState<string|null>(null)
 const load=async()=>{
  if(!api.listWorkspaces)return
  setLd(true);setErr(null)
  try{
   const list=await api.listWorkspaces()
   setWs(list)
   const cfg=await api.getConfig()
   setCur(cfg.workspaceId)
   setNote(cfg.workspaceId&&!list.some(w=>(w.workspaceId??w.id)===cfg.workspaceId)?'selected workspace is no longer available; please select another':null)
  }catch{setErr('connection_unavailable')}
  finally{setLd(false)}
 }
 useEffect(()=>{void load()},[api])
 return{ws,cur,ld,err,note,setCur,setLd,setErr,setNote,load}
}