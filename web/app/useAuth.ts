import { useState, useEffect, useCallback } from 'react'
import { canSubmit as ok, toAuthCode as tc, type AuthCode, type AuthPort } from '../domain/auth'
export function useAuth(p: AuthPort) {
  const[a,setA]=useState(false)
  const[b,setB]=useState(false)
  const[r,setR]=useState(false)
  const[c,setC]=useState<AuthCode>(null)
  useEffect(() => {
    p.session().then(()=>{setA(true);setC(null)}).catch((e)=>{const k=tc(e);setA(false);setC(k==='authFailed'?null:k)}).finally(()=>setR(true))
  }, [p])
  async function login(w: string) {
    if(!ok(w)){setC('needPassword');return}
    setB(true)
    try{await p.login(w);setA(true);setC(null)}catch(e){setC(tc(e));setA(false)}finally{setB(false)}
  }
  async function logout() {
    setB(true)
    try{await p.logout();setA(false);setC(null)}catch(e){setC(tc(e))}finally{setB(false)}
  }
  const expire=useCallback(()=>{setA(false);setC(null)},[])
  return { authed: a, busy: b, ready: r, code: c, login, logout, expire }
}
