import{useState,type FormEvent}from'react'
import{usePinPreferred}from'../app/usePinPreferred'
import{resolveLoginMode}from'../domain/loginMode'

export type LoginFormProps={busy:boolean;onLogin:(pw:string)=>void;onPinLogin?:(pin:string)=>void;pinPreferred?:boolean|null}

export function useLoginForm(onLogin:(pw:string)=>void,onPinLogin?:(pin:string)=>void,pinPreferred?:boolean|null){
 const[pw,setPw]=useState('')
 const[pin,setPin]=useState('')
 const[password,setPassword]=useState(false)
 const auto=usePinPreferred(pinPreferred===undefined&&!!onPinLogin)
 const available=!!onPinLogin&&(pinPreferred===undefined?auto:pinPreferred)===true
 const usePin=resolveLoginMode(available,password)==='pin'
 const submit=(e:FormEvent)=>{
  e.preventDefault()
  usePin?onPinLogin?.(pin):onLogin(pw)
 }
 return{pw,setPw,pin,setPin,usePin,pinAvailable:available,setPassword,submit}
}
