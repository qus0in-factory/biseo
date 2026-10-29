import{isPaneListEvent}from'./herdr-watch-events.js'
import type{Timer,Watch,WatchDeps}from'./herdr-watch-types.js'
export function startHerdrWatch(d:WatchDeps):Watch{
 let h=false,off:(()=>void)|undefined,timer:Timer|undefined,gen=0,n=0
 const later=(f:()=>void,ms:number)=>{if(h||timer)return;timer=setTimeout(()=>{timer=undefined;f()},ms)}
 const retry=(e?:unknown)=>{d.onError?.(e);later(connect,Math.min(d.maxMs||3e4,(d.baseMs||500)*2**n++))}
 const restart=()=>{if(h)return;gen++;off?.();off=undefined;if(timer){clearTimeout(timer);timer=undefined}connect()}
 const connect=async()=>{
  if(h)return
  const g=++gen
  try{
   const ids=await d.listPanes()
   const f=await d.subscribe(ids,e=>{if(g!==gen)return;d.onEvent(e);if(isPaneListEvent(e))restart()},()=>{if(g===gen){off=undefined;retry()}})
   if(h||g!==gen)return f()
   off=f;n=0;d.onReady?.()
  }catch(e){if(g===gen)retry(e)}
 }
 connect()
 return{stop(){h=true,gen++;if(timer)clearTimeout(timer);timer=undefined;off?.();off=undefined},refresh:restart}
}
