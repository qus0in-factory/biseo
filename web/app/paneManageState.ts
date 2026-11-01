import{useState}from'react'
import { usePaneManageList } from './usePaneManageList'
export function usePaneManageState(w?:string){
 const list = usePaneManageList(w)
 const[template,setTemplate]=useState('opencode')
 const[name,setName]=useState('')
 const[busy,setBusy]=useState(false)
 const[msg,setMsg]=useState<string|null>(null)
 const[confirmId,setConfirmId]=useState<string|null>(null)
 const[renameId,setRenameId]=useState<string|null>(null)
 const[renameName,setRenameName]=useState('')
 return{...list,template,name,busy,msg,confirmId,renameId,renameName,setTemplate,setName,setBusy,setMsg,setConfirmId,setRenameId,setRenameName}
}
