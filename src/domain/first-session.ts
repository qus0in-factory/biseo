import type{AgentSession}from'./herdr.js'
import type{Target}from'./turn-policy.js'
export function targetSession(t:Target){return t.agent?.agent_session??t.pane.agent_session??undefined}
export function isFirstSession(t:Target){return(t.agent?.agent??t.pane.agent)==='opencode'&&!targetSession(t)}
export function isOpencodeSession(s:AgentSession|undefined|null){return!!s&&s.source==='herdr:opencode'}
