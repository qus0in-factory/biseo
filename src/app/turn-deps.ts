import type{AvailabilityPort,CapturePort,HerdrPort}from'./ports.js'
import type{LimitScreen}from'./limit-screen.js'
import type{AuditLog}from'./interrupt-audit.js'
import type{PaneLocks}from'./pane-locks.js'
import type{TurnStore}from'./turn-store.js'
import type{TurnQueue}from'./turn-queue.js'
export type TurnDeps={allowedWorkspaceId?:string;lateCaptureMs?:number;promptAcceptanceMs?:number;firstSessionMs?:number;targetGraceMs?:number;queueParkMs?:number;watch?:()=>void;herdr:HerdrPort;capture:CapturePort;availability?:AvailabilityPort;limit?:LimitScreen;interruptAllowlist?:Record<string,string[]>;audit?:AuditLog;store:TurnStore;locks:PaneLocks;queue:TurnQueue;timeoutMs:number;graceMs:number}
