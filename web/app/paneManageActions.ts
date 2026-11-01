import{workspaceApi as a}from'../infra/workspaceApi'
import r from'../resources.json'
import type{usePaneManageState}from'./paneManageState'
import { renamePaneAction } from './renamePaneAction'
type S=ReturnType<typeof usePaneManageState>
export function createPaneManageActions(s:S){
 const open=async()=>{s.setBusy(true);s.setMsg(null);try{await a.openPane?.({templateId:s.template,name:s.name||undefined});s.setMsg(r.paneOpenSuccess);s.setName('');await s.load()}catch{s.setMsg('connection_unavailable')}finally{s.setBusy(false)}}
 const close=async(id:string)=>{s.setBusy(true);s.setMsg(null);try{await a.closePane?.(id);s.setMsg(r.paneCloseSuccess);s.setConfirmId(null);await s.load()}catch{s.setMsg('connection_unavailable')}finally{s.setBusy(false)}}
 const rename=(id:string)=>renamePaneAction(s,a.renamePane!,id)
 return{open,close,rename}
}
