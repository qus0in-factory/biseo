import{type Row,parseTurn}from'./opencode-parse.js'
import{confirmOpencode}from'./opencode-confirm.js'
import{opencodeDb,opencodePath}from'./opencode-db.js'
import{waitChange}from'./transcript-io.js'
const ses=/^ses_[A-Za-z0-9]+$/,tbl='FROM session_message WHERE session_id=?'
export function beginOpencode(id:string,q:string){
 if(!ses.test(id))return null
 const p=opencodePath()
 const b=opencodeDb(p,d=>(d.prepare(`SELECT COALESCE(MAX(seq),-1)as m ${tbl}`).get(id)as{m:number}).m)
 if(b===null)return null
 return{
  read:async(ms:number)=>{
   const end=Date.now()+ms
   for(;;){
    const r=opencodeDb(p,d=>parseTurn(d.prepare(`SELECT type,data ${tbl} AND seq>? ORDER BY seq`).all(id,b)as Row[],q))
    if(r?.done)return r.text
    if(Date.now()>=end)return null
    await waitChange(p+'-wal',end-Date.now())
   }
  },
  confirm:async()=>confirmOpencode(p,id,b,q),
 }
}
