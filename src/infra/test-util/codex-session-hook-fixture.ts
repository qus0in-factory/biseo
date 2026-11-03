import{existsSync,mkdtempSync,readdirSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{run}from'./codex-session-hook-run-fixture.js'
import{fakeHerdr}from'./codex-session-hook-herdr-fixture.js'
export const input=JSON.stringify({session_id:'s1',transcript_path:'/home/test/.codex/sessions/a.jsonl'})
export const base=(fn:(dir:string)=>void)=>{
 const dir=mkdtempSync(join(tmpdir(),'biseo-hook-'))
 try{fn(dir)}finally{rmSync(dir,{recursive:true,force:true})}
}
export const recordCount=(dir:string)=>
 existsSync(join(dir,'codex'))?readdirSync(join(dir,'codex')).length:0
export const spawn=(dir:string,env:Record<string,string>,herdr?:string)=>{
 const bin=herdr?fakeHerdr(dir,herdr):undefined
 return run(dir,bin?{...env,HERDR_BIN_PATH:bin}:env,input)
}
