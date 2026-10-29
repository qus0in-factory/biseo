import{opencodeDb}from'./opencode-db.js'
export function confirmOpencode(p:string,id:string,after:number,q:string){
 const rows=opencodeDb(p,d=>d.prepare("SELECT data FROM session_message WHERE session_id=? AND seq>? AND type='user' ORDER BY seq").all(id,after)as{data:string}[])
 return !!rows?.some(r=>text(r.data)===q.trim())
}
function text(raw:string){try{const v=JSON.parse(raw)as{text?:unknown};return typeof v.text==='string'?v.text.trim():''}catch{return''}}
