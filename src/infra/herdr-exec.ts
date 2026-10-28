import {execFile}from'node:child_process'
import {promisify}from'node:util'
const run=promisify(execFile)
export class HerdrError extends Error{constructor(readonly code:string){super(code)}}
type Reply={result?:Record<string,unknown>}
export async function call(args:string[],timeout:number):Promise<Reply>{
 try{
  const {stdout}=await run(process.env.HERDR_BIN_PATH??'herdr',args,{timeout,maxBuffer:8<<20})
  return JSON.parse(stdout) as Reply
 }catch(e){
  const x=e as{code?:unknown;stderr?:string;killed?:boolean}
  if(x.killed)throw new HerdrError('timeout')
  const code=codeOf(String(x.stderr??''))??(typeof x.code==='string'?x.code:'herdr_error')
  throw new HerdrError(code)
 }
}
function codeOf(s:string):string|undefined{
 try{const j=JSON.parse(s);return j?.error?.code??j?.code}catch{return}
}
export const notFound=(e:unknown)=>e instanceof HerdrError&&/not_found$/.test(e.code)
