const t=new Map<string,ReturnType<typeof setTimeout>>()
export function retrySoon(p:string,run:()=>void,ms:number){
 if(t.has(p))return
 const h=setTimeout(()=>{t.delete(p);run()},ms)
 h.unref?.()
 t.set(p,h)
}
export function clearSoon(p:string){
 const h=t.get(p)
 if(!h)return
 clearTimeout(h)
 t.delete(p)
}
