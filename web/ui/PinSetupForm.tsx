import{useState}from'react'
import{Button}from'../components/ui/button'
import{isPin}from'../domain/pin'
import{pinApi}from'../infra/pinApi'
import{PinClearButton}from'./PinClearButton'
import{PinInput}from'./PinInput'
import r from'../resources.json'
export function PinSetupForm({configured,onChange}:{configured:boolean;onChange:()=>void}){
 const[pin,setPin]=useState('')
 const[busy,setBusy]=useState(false)
 const[failed,setFailed]=useState(false)
 async function save(){
  setBusy(true);setFailed(false)
  try{await pinApi.setPin(pin);setPin('');onChange()}catch{setFailed(true)}finally{setBusy(false)}
 }
 return<form className="flex flex-wrap items-end gap-2" onSubmit={e=>{e.preventDefault();void save()}}>
  <PinInput pin={pin} onChange={setPin} disabled={busy} label={configured?r.changePin:r.setPin}/>
  <Button type="submit" disabled={busy||!isPin(pin)}>{r.savePin}</Button>
  {configured&&<PinClearButton onChange={onChange}/>}
  {failed&&<span className="text-xs text-error">{r.unknown}</span>}
 </form>
}
