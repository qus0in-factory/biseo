import type{AgentSession}from'./herdr.js'
const supported=['herdr:claude','herdr:antigravity_cli','herdr:opencode','herdr:codex','biseo:codex']
export function captureSupported(s:AgentSession|undefined|null){return !!s&&supported.includes(s.source)}
export function captureReason(s:AgentSession|undefined|null){
 if(!s)return 'no_agent_session'
 return captureSupported(s)?'path_unresolved':'unsupported_agent'
}
