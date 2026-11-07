import {base}from'./config-file.js'
import {resolve}from'node:path'
const e=process.env
export function servicePublicKeyPath(env=e.SERVICE_PUBLIC_KEY_PATH,file=base.servicePublicKeyPath,cwd=process.cwd()){
 const picked=(env||file||'').trim()
 return picked||resolve(cwd,'config/service-public.key')
}
export const serviceConfig={
 host:e.HOST??base.host,
 port:Number(e.PORT??base.port),
 healthStatus:e.HEALTH_STATUS??base.healthStatus,
 serviceIssuer:e.SERVICE_ISSUER??base.serviceIssuer,
 serviceAudience:e.SERVICE_AUDIENCE??base.serviceAudience,
 servicePublicKeyPath:servicePublicKeyPath(),
}
