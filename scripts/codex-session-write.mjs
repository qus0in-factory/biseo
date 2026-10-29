import{chmodSync,mkdirSync,readFileSync,renameSync,unlinkSync,writeFileSync}from'node:fs'
import{join}from'node:path'
import{resolvePane}from'./codex-pane.mjs'
let t
try{
 const j=JSON.parse(readFileSync(0,'utf8')),pid=+process.argv[2]
 if(typeof j.session_id!=='string'||!/^[A-Za-z0-9_-]+$/.test(j.session_id)||typeof j.transcript_path!=='string'||j.transcript_path[0]!=='/'||!(pid>1))throw 0
 const pane=resolvePane(j.session_id)
 if(!pane)throw 0
 const d=join(process.env.BISEO_STATE_DIR||join(process.env.HOME||'','.local/state/biseo'),'codex'),k=Buffer.from(pane).toString('hex')
 mkdirSync(d,{recursive:true,mode:0o700})
 chmodSync(d,0o700)
 t=join(d,`.${k}.${process.pid}.tmp`)
 writeFileSync(t,JSON.stringify({session_id:j.session_id,transcript_path:j.transcript_path,pane_id:pane,pid,created_at:Date.now()}),{mode:0o600,flag:'wx'})
 renameSync(t,join(d,k+'.json'))
}catch{try{t&&unlinkSync(t)}catch{}}
