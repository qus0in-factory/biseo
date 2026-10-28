import type{SSEStreamingApi}from'hono/streaming'
export type Loop={closed:()=>boolean;refresh:()=>void;send:()=>Promise<void>;end:()=>void;beat:()=>void;ended:Promise<void>}
export function sseLoop(stream:SSEStreamingApi,write:()=>Promise<void>,onEnd:()=>void,heartbeatMs=15000):Loop{
 let closed=false,timer:ReturnType<typeof setTimeout>|undefined,hb:ReturnType<typeof setInterval>|undefined,done=()=>{}
 const ended=new Promise<void>(r=>{done=r})
 const end=()=>{if(closed)return;closed=true;clearTimeout(timer);if(hb)clearInterval(hb);onEnd();done()}
 const send=async()=>{if(closed)return;try{await write()}catch{end()}}
 const refresh=()=>{clearTimeout(timer);timer=setTimeout(()=>void send(),120)}
 const beat=()=>{hb=setInterval(()=>{if(!closed)void stream.writeSSE({event:'heartbeat',data:'{}'}).catch(end)},heartbeatMs)}
 return {closed:()=>closed,refresh,send,end,beat,ended}
}
