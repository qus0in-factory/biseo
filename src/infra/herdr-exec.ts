import {execFile}from'node:child_process'
import {promisify}from'node:util'
import type{Logger}from'pino'
import {errorCodeOf,HerdrError,notFound}from'./herdr-error.js'
import {logger}from'./logger.js'
export {HerdrError,notFound}
const run=promisify(execFile)
type Reply={result?:Record<string,unknown>}
export async function call(args:string[],timeout:number,log:Logger=logger):Promise<Reply>{
 const t0=Date.now(),command=args.slice(0,2).join(' ')
 try{
  const {stdout}=await run(process.env.HERDR_BIN_PATH??'herdr',args,{timeout,maxBuffer:8<<20})
  log.info({command,code:'ok',durationMs:Date.now()-t0},'herdr.call')
  return JSON.parse(stdout) as Reply
 }catch(e){
  const code=errorCodeOf(e)
  log.warn({command,code,durationMs:Date.now()-t0},'herdr.call')
  throw new HerdrError(code)
 }
}
