import {serve}from'@hono/node-server'
import {createVerifyService}from'./app/verify-service.js'
import {PaneLocks}from'./app/pane-locks.js'
import {TurnStore}from'./app/turn-store.js'
import {config}from'./config.js'
import {HerdrCli}from'./infra/herdr-cli.js'
import {logger}from'./infra/logger.js'
import {loadServiceVerifier}from'./infra/service-verifier.js'
import {createCapture}from'./infra/transcript-capture.js'
import {createApp}from'./ui/app.js'
const verify=createVerifyService(await loadServiceVerifier(config.servicePublicKeyPath),{issuer:config.serviceIssuer,audience:config.serviceAudience})
const app=createApp({
 verify,healthStatus:config.healthStatus,allowedWorkspaceId:config.allowedWorkspaceId,
 store:new TurnStore(),locks:new PaneLocks(),herdr:new HerdrCli(),capture:createCapture(),
 timeoutMs:config.turnTimeoutMs,graceMs:config.captureGraceMs,lateCaptureMs:config.lateCaptureMs,
})
serve({fetch:app.fetch,hostname:config.host,port:config.port},i=>logger.info({port:i.port},'listening'))
