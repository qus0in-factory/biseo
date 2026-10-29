import type{CapturePort,HerdrPort}from'./ports.js'
import type{PaneLocks}from'./pane-locks.js'
import type{TurnStore}from'./turn-store.js'
export type TurnDeps={allowedWorkspaceId?:string;lateCaptureMs?:number;herdr:HerdrPort;capture:CapturePort;store:TurnStore;locks:PaneLocks}
