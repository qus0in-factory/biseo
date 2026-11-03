import{useEffect,useState}from'react'
import type{WorkspaceApiPort,WorkspaceSummary}from'../domain/ports'
import { listState } from '../domain/asyncListState'
import { missingWorkspaceNotice } from './workspacePickerNotice'
export function useWorkspacePicker(api:WorkspaceApiPort){
 const [ws,setWs]=useState<WorkspaceSummary[]>([])
 const [cur,setCur]=useState<string|null>(null)
 const [ld,setLd]=useState(true)
 const [err,setErr]=useState<string|null>(null)
 const [note,setNote]=useState<string|null>(null)
 const load=async()=>{
  setLd(true);setErr(null)
  try{
   if(!api.listWorkspaces)throw new Error()
   const list=await api.listWorkspaces()
   setWs(list)
   const cfg=await api.getConfig()
   setCur(cfg.workspaceId)
   setNote(missingWorkspaceNotice(cfg.workspaceId,list,false,null))
  }catch{setErr('connection_unavailable')}
  finally{setLd(false)}
 }
 useEffect(()=>{void load()},[api])
 return{ws,cur,ld,err,note,state:listState(ws,ld,err),setCur,setLd,setErr,setNote,load}
}
