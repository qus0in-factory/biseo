import{rmSync}from'node:fs'
import{clearAgyTokenCache}from'./agy-token.js'
import{putAgyTokenFile,agyTestEnv}from'./agy-test-support.test-util.js'
import{setAgyCliRun,resetAgyCliRun}from'./agy-cli-run.js'
import{resetAgyCliCache}from'./agy-cli-fallback.js'
export const cliTsv='gemini-test\t5h\t80%\t2026-11-01T00:00:00Z'
export const fail401=(u:string)=>new Response('no',{status:u.includes('token.example')?400:401})
export function setupCli(name:string,exp:string,ena:string,out:string|null,calls:string[],route:(u:string)=>Response){
 const p=putAgyTokenFile(name,exp)
 agyTestEnv(p)
 process.env.BISEO_AGY_CLI_ENABLED=ena
 clearAgyTokenCache()
 resetAgyCliCache()
 setAgyCliRun(async()=>{calls.push('cli');if(out===null)throw't';return out})
 const o=globalThis.fetch
 globalThis.fetch=(async(u:string)=>route(String(u)))as typeof fetch
 return{p,o}
}
export function doneCli(p:string,o:typeof fetch):void{globalThis.fetch=o;resetAgyCliRun();rmSync(p)}
