import assert from'node:assert/strict'
import{readFileSync,readdirSync,statSync}from'node:fs'
import{join}from'node:path'
import{file}from'./codex-session-hook-script-fixture.js'
export function checkWrite(base:string,rec:any){
 const path=file(base,'w1T:p2')
 const got=JSON.parse(readFileSync(path,'utf8'))
 assert.equal(got.session_id,'s1')
 assert.equal(got.transcript_path,rec.transcript_path)
 assert.equal(got.pane_id,'w1T:p2')
 if(!(Number.isInteger(got.pid)&&got.pid>1))throw new Error('pid')
 if(!(typeof got.created_at==='number'&&Math.abs(Date.now()-got.created_at)<10000))throw new Error('created_at')
 if((statSync(path).mode&0o777)!==0o600)throw new Error('mode')
 if(JSON.stringify(readdirSync(join(base,'codex')))!==JSON.stringify(['7731543a7032.json']))throw new Error('files')
}
