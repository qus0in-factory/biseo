import {readFile,realpath}from'node:fs/promises'
import {homedir}from'node:os'
import {isAbsolute,join,relative,sep}from'node:path'
import {codexPid}from'./codex-pid.js'
type V={session_id:string;transcript_path:string}
const id=/^[A-Za-z0-9_-]+$/
export async function valid(path:string):Promise<V|null>{
 try{
  const r=JSON.parse(await readFile(path,'utf8').catch(()=>''))
  if(typeof r?.session_id!=='string'||!id.test(r.session_id))return null
  if(typeof r.transcript_path!=='string'||r.transcript_path[0]!=='/')return null
  if(!Number.isInteger(r.pid)||r.pid<2||typeof r.created_at!=='number')return null
  if(!await codexPid(r.pid))return null
  const p=await realpath(r.transcript_path).catch(()=>null)
  const b=await realpath(process.env.BISEO_CODEX_DIR??join(homedir(),'.codex/sessions')).catch(()=>null)
  if(!p||!b)return null
  const rel=relative(b,p)
  if(!rel||isAbsolute(rel)||rel==='..'||rel.startsWith('..'+sep))return null
  return {session_id:r.session_id,transcript_path:p}
 }catch{return null}
}
