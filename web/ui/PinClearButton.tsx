import{useState}from'react'
import{Button}from'../components/ui/button'
import{pinApi}from'../infra/pinApi'
import r from'../resources.json'
export function PinClearButton({onChange}:{onChange:()=>void}){
 const[busy,setBusy]=useState(false)
 async function clear(){
  setBusy(true)
  try{await pinApi.clearPin();onChange()}catch{}finally{setBusy(false)}
 }
 return<Button type="button" variant="ghost" onClick={()=>void clear()} disabled={busy}>{r.clearPin}</Button>
}
