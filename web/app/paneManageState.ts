import{useEffect,useState}from'react'
import{workspaceApi as a}from'../infra/workspaceApi'
type P={paneId:string;name:string}
export function usePaneManageState(w?:string){
 const[ws,setWs]=useState(w??'')
 const[panes,setPanes]=useState<P[]>([])
 const[template,setTemplate]=useState('opencode')
 const[name,setName]=useState('')
 const[busy,setBusy]=useState(false)
 const[msg,setMsg]=useState<string|null>(null)
 const[confirmId,setConfirmId]=useState<string|null>(null)
 const[renameId,setRenameId]=useState<string|null>(null)
 const[renameName,setRenameName]=useState('')
 const load=async()=>{try{const c=await a.getConfig();setWs(c.workspaceId);const l=await a.getPanes(c.workspaceId);setPanes(l.map(x=>({paneId:x.paneId,name:x.name})))}catch{setMsg('connection_unavailable')}}
 useEffect(()=>{void load()},[])
 return{ws,panes,template,name,busy,msg,confirmId,renameId,renameName,setWs,setPanes,setTemplate,setName,setBusy,setMsg,setConfirmId,setRenameId,setRenameName,load}
}
