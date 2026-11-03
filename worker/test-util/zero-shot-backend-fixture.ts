import{PaneLocks}from'../../src/app/pane-locks.js'
import{TurnStore}from'../../src/app/turn-store.js'
import{TurnQueue}from'../../src/app/turn-queue.js'
import{createVerifyService}from'../../src/app/verify-service.js'
import{createApp}from'../../src/ui/app.js'
import{importVerificationKey}from'../../shared/infra/paserk.js'
import{PasetoV4PublicVerifier}from'../../shared/infra/paseto-v4-public.js'
import{createZeroShotPorts}from'./zero-shot-ports-fixture.js'
export async function createZeroShotBackend(pubKey:string){
 const key=await importVerificationKey(pubKey as `k4.public.${string}`)
 const verify=createVerifyService(new PasetoV4PublicVerifier(key,5),{issuer:'biseo',audience:'biseo-service'})
 const{herdr,capture,getPromptCalls}=createZeroShotPorts()
 const backend=createApp({verify,healthStatus:'ok',allowedWorkspaceId:'w1T',store:new TurnStore(),locks:new PaneLocks(),queue:new TurnQueue(),herdr,capture,timeoutMs:1000,graceMs:0})
 return{backend,getPromptCalls}
}
