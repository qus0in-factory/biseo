import {execFileSync}from'node:child_process'
export function codexPid(pid:number){
 try{process.kill(pid,0)}catch(e){if((e as NodeJS.ErrnoException).code==='ESRCH')return false}
 try{return /codex/i.test(execFileSync('ps',['-o','comm=','-p',String(pid)],{encoding:'utf8'}))}catch{return true}
}
