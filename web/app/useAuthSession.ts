import{useEffect}from'react'
import{toAuthCode,type AuthCode,type AuthPort}from'../domain/auth'
export function useAuthSession(p:AuthPort,auth:(v:boolean)=>void,code:(v:AuthCode)=>void,ready:(v:boolean)=>void){
 useEffect(()=>{
  p.session().then(()=>{auth(true);code(null)})
   .catch(e=>{const k=toAuthCode(e);auth(false);code(k==='authFailed'?null:k)})
   .finally(()=>ready(true))
 },[p,auth,code,ready])
}
