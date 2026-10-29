import{serve}from'@hono/node-server'
import{createVerifyService}from'./app/verify-service.js'
import{createState,startQueueWatch}from'./infra/herdr-watch-boot.js'
import{config as c}from'./config.js'
import{HerdrCli}from'./infra/herdr-cli.js'
import{logger}from'./infra/logger.js'
import{loadServiceVerifier as f}from'./infra/service-verifier.js'
import{createCapture}from'./infra/transcript-capture.js'
import{createApp}from'./ui/app.js'
const v=createVerifyService(await f(c.servicePublicKeyPath),{issuer:c.serviceIssuer,audience:c.serviceAudience})
const{store,locks,queue}=createState()
const d={verify:v,healthStatus:c.healthStatus,allowedWorkspaceId:c.allowedWorkspaceId,store,locks,queue,herdr:new HerdrCli(),capture:createCapture(),timeoutMs:c.turnTimeoutMs,graceMs:c.captureGraceMs,lateCaptureMs:c.lateCaptureMs,promptAcceptanceMs:c.promptAcceptanceMs,targetGraceMs:c.targetGraceMs}
startQueueWatch(d)
serve({fetch:createApp(d).fetch,hostname:c.host,port:c.port},i=>logger.info({port:i.port},'listening'))
