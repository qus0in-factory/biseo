import{type Row,parseTurn}from'./opencode-parse.js'
import{confirmOpencode as cf}from'./opencode-confirm.js'
import{opencodeDb as db,opencodePath as dp}from'./opencode-db.js'
import{waitChange as w}from'./transcript-io.js'
const ses=/^ses_[A-Za-z0-9]+$/,tbl='FROM session_message WHERE session_id=?'
const open=(id:string,q:string,b:number,p:string)=>({read:async(m:number)=>{for(let e=Date.now()+m;;){const r=db(p,d=>parseTurn(d.prepare(`SELECT type,data ${tbl} AND seq>? ORDER BY seq`).all(id,b)as Row[],q));if(r?.done)return r.text;if(Date.now()>=e)return null;await w(p+'-wal',e-Date.now())}},confirm:async()=>cf(p,id,b,q)})
export function beginOpencode(id:string,q:string){
 if(!ses.test(id))return null
 const p=dp(),b=db(p,d=>(d.prepare(`SELECT COALESCE(MAX(seq),-1)as m ${tbl}`).get(id)as{m:number}).m)
 return b===null?null:open(id,q,b,p)
}
export function beginOpencodeFromStart(id:string,q:string){
 if(!ses.test(id))return null
 const p=dp()
 return db(p,()=>1)===1?open(id,q,-1,p):null
}
