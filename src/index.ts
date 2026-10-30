import{serve}from'@hono/node-server'
import{createVerifyService}from'./app/verify-service.js'
import{startQueueWatch}from'./infra/herdr-watch-boot.js'
import{runtimeDeps}from'./infra/runtime-deps.js'
import{config as c}from'./config.js'
import{validateConfig}from'./config-validation.js'
import{logger}from'./infra/logger.js'
import{loadServiceVerifier as f}from'./infra/service-verifier.js'
import{createApp}from'./ui/app.js'
validateConfig(c)
logger.info({turnTimeoutMs:c.turnTimeoutMs,lateCaptureMs:c.lateCaptureMs,promptAcceptanceMs:c.promptAcceptanceMs},'config.effective')
const v=createVerifyService(await f(c.servicePublicKeyPath),{issuer:c.serviceIssuer,audience:c.serviceAudience}),d=runtimeDeps(v)
startQueueWatch(d)
serve({fetch:createApp(d).fetch,hostname:c.host,port:c.port},i=>logger.info({port:i.port},'listening'))
