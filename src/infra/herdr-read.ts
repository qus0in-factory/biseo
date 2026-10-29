import {execFile}from'node:child_process'
import {promisify}from'node:util'
import {errorCodeOf,HerdrError}from'./herdr-error.js'
import {logger}from'./logger.js'
const run=promisify(execFile)
export async function readRecent(id:string,lines:number){
 const t0=Date.now()
 try{
  const {stdout}=await run(process.env.HERDR_BIN_PATH??'herdr',['pane','read',id,'--source','recent','--lines',String(lines),'--format','text'],{timeout:15000,maxBuffer:1<<20})
  logger.info({command:'pane read',code:'ok',durationMs:Date.now()-t0},'herdr.call')
  return stdout.split(/\r?\n/).filter(Boolean)
 }catch(e){
  logger.warn({command:'pane read',code:errorCodeOf(e),durationMs:Date.now()-t0},'herdr.call')
  throw new HerdrError(errorCodeOf(e))
 }
}
