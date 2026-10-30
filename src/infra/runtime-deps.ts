import{config as c}from'../config.js'
import{createAvailability}from'./codex-availability.js'
import{createCapture}from'./transcript-capture.js'
import{createState}from'./herdr-watch-boot.js'
import{WorkspaceHerdr}from'./workspace-herdr.js'
import{readWorkspace}from'./workspace-config.js'
import{limitScreen}from'../app/limit-screen.js'
import{UsageCollector}from'./usage-collector.js'
import type{TurnDeps}from'../app/turn-deps.js'
type Verify=(t?:string)=>Promise<void>
export function runtimeDeps(verify:Verify):TurnDeps&{verify:Verify;healthStatus:string}{
 const{store,locks,queue}=createState(),herdr=new WorkspaceHerdr(),availability=createAvailability(c.availabilityTtlMs)
 const usageCollector=new UsageCollector(),i=limitScreen(herdr,c.inputMarkers)
 return{...c,verify,get allowedWorkspaceId(){return readWorkspace()},store,locks,queue,herdr,capture:createCapture(),availability,limit:limitScreen(herdr,c.limitMarkers),input:i,timeoutMs:c.turnTimeoutMs,graceMs:c.captureGraceMs,usageCollector}
}
