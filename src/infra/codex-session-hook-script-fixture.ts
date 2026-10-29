import{fileURLToPath}from'node:url'
import{join}from'node:path'
export const script=fileURLToPath(new URL('../../scripts/codex-session-hook.sh',import.meta.url))
export const file=(base:string,pane:string)=>join(base,'codex',Buffer.from(pane).toString('hex')+'.json')
export{join}
