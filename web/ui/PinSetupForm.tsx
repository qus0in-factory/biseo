import { SettingsAction } from './SettingsAction'
import { Save } from 'lucide-react'
import{isPin}from'../domain/pin'
import { usePinSetup } from '../app/usePinSetup'
import{PinClearButton}from'./PinClearButton'
import{PinInput}from'./PinInput'
import r from'../resources.json'
export function PinSetupForm({configured,onChange}:{configured:boolean;onChange:()=>void}){
 const {pin,setPin,busy,failed,save}=usePinSetup(onChange)
 return<form className="flex flex-wrap items-end gap-2" onSubmit={e=>{e.preventDefault();void save()}}>
  <PinInput pin={pin} onChange={setPin} disabled={busy} label={configured?r.changePin:r.setPin}/>
  <SettingsAction icon={Save} type="submit" busy={busy} disabled={!isPin(pin)}>{r.savePin}</SettingsAction>
  {configured&&<PinClearButton onChange={onChange}/>}
  {failed&&<span className="text-xs text-error">{r.unknown}</span>}
 </form>
}
