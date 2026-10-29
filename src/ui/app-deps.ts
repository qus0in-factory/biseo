import type{TurnDeps}from'../app/turn-deps.js'
export type AppDeps=TurnDeps&{verify:(t?:string)=>Promise<void>;healthStatus:string;timeoutMs:number;graceMs:number}
