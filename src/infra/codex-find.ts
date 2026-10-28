import {lstat,readdir}from'node:fs/promises'
import {homedir}from'node:os'
import {join}from'node:path'
import type{AgentSession}from'../domain/herdr.js'
import {codexTranscriptPath}from'./codex-session.js'
// Herdr가 codex 세션을 보고한 경우: rollout 파일명 끝의 세션 ID로 찾는다(심볼릭 링크 제외).
export async function findRollout(id:string):Promise<string|null>{
 const root=process.env.BISEO_CODEX_DIR??join(homedir(),'.codex','sessions')
 if(!/^[0-9a-f]{8}(-[0-9a-f]{4}){3}-[0-9a-f]{12}$/.test(id))return null // 부분 ID 접미사 오매칭 방지
 const want=`-${id}.jsonl`
 const names=await readdir(root,{recursive:true}).catch(()=>[] as string[])
 for(const n of names.filter(n=>n.endsWith(want)).sort().reverse()){
  const p=join(root,n)
  if(await lstat(p).then(s=>s.isFile()).catch(()=>false))return p
 }
 return null
}
export const codexPath=(s:AgentSession)=>s.source==='biseo:codex'?codexTranscriptPath(s.value):findRollout(s.value)
