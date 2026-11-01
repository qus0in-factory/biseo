import{useEffect,useRef}from'react'
export function useUsageInterval(enabled:boolean,load:()=>Promise<void>){
 const live=useRef(true)
 useEffect(()=>{
  if(!enabled)return
  live.current=true
  void load()
  const t=setInterval(()=>void load(),60000)
  return()=>{live.current=false;clearInterval(t)}
 },[enabled,load])
 return live
}
