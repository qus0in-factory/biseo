export const rec=(id:string,p:string,pid=process.pid)=>JSON.stringify({session_id:id,transcript_path:p,pane_id:'x',pid,created_at:Date.now()})
export const key=(pane:string)=>Buffer.from(pane).toString('hex')
