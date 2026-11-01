import{useState}from'react'
import { SettingsAction } from './SettingsAction'
import { Trash2 } from 'lucide-react'
import{pinApi}from'../infra/pinApi'
import r from'../resources.json'
export function PinClearButton({onChange}:{onChange:()=>void}){
 const[busy,setBusy]=useState(false)
 async function clear(){
  setBusy(true)
  try{await pinApi.clearPin();onChange()}catch{}finally{setBusy(false)}
 }
 return<SettingsAction icon={Trash2} danger type="button" onClick={()=>void clear()} busy={busy}>{r.clearPin}</SettingsAction>
}
