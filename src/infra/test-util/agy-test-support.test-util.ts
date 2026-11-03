import{mkdtempSync,rmSync,writeFileSync}from'node:fs'
import{clearAgyTokenCache}from'../agy-token.js';import{tmpdir}from'node:os';import{dirname,join}from'node:path'
export const agyTestGroup={displayName:'Pool',families:['unknown'],buckets:[{bucketId:'3p-5h',window:'5h',remainingFraction:1}]}
export function putAgyTokenFile(n:string,expiry:string):string{
 const p=join(mkdtempSync(join(tmpdir(),`biseo-agy-${n}-`)),'token.json')
 writeFileSync(p,JSON.stringify({token:{access_token:'old',refresh_token:'rt',expiry}}))
 return p
}
export function removeAgyTokenFile(path:string):void{rmSync(dirname(path),{recursive:true,force:true})}
export function agyTestEnv(path:string):void{
 clearAgyTokenCache()
 const e=process.env
 e.BISEO_AGY_TOKEN_PATH=path;e.BISEO_AGY_TOKEN_URL??='https://token.example'
 e.BISEO_AGY_CLIENT_ID??='id';e.BISEO_AGY_CLIENT_ID_FILE=join(dirname(path),'no-client-id')
 e.BISEO_AGY_KEYCHAIN_ENABLED='0';e.BISEO_AGY_CLI_ENABLED='0'
}
export function agyQuotaBody(u:string):unknown{return u.includes('retrieveUserQuotaSummary')?{groups:[agyTestGroup]}:{buckets:[]}}
