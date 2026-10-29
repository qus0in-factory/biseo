import {base}from'./config-file.js'
const e=process.env
export const serviceConfig={
 host:e.HOST??base.host,
 port:Number(e.PORT??base.port),
 healthStatus:e.HEALTH_STATUS??base.healthStatus,
 serviceIssuer:e.SERVICE_ISSUER??base.serviceIssuer,
 serviceAudience:e.SERVICE_AUDIENCE??base.serviceAudience,
 servicePublicKeyPath:e.SERVICE_PUBLIC_KEY_PATH??base.servicePublicKeyPath,
}
