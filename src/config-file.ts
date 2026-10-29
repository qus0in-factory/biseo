import {readFileSync}from'node:fs'
import {resolve}from'node:path'
export type RuntimeConfig={host:string;port:number;healthStatus:string;serviceIssuer:string;serviceAudience:string;servicePublicKeyPath:string;allowedWorkspaceId?:string;turnTimeoutMs?:number;lateCaptureMs?:number;captureGraceMs?:number;promptAcceptanceMs?:number;firstSessionMs?:number;targetGraceMs?:number;availabilityTtlMs?:number;logLevel?:string;limitMarkers?:string[];interruptAllowlist?:Record<string,string[]>}
const file=resolve(process.cwd(),'config/runtime.json')
export const base=JSON.parse(readFileSync(file,'utf8')) as RuntimeConfig
