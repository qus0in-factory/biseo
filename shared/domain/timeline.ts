import type{Availability}from'./availability.js'
export type*from'./availability.js'
export type PaneStatus='idle'|'working'|'blocked'|'done'|'unknown'
export type DisabledReason='agent_busy'|'agent_blocked'|'agent_unknown'|'no_agent_in_pane'|'response_capture_unavailable'|'provider_rate_limited'|null
export type BlockedReason='usage_limit'|'input_request'|'unknown'|null
export type TurnStatus='queued'|'working'|'completed'|'capture_unavailable'|'blocked'|'failed'|'timeout'|'cancelled'
export type PaneSummary={paneId:string;tabId:string;name:string;agentKind:string|null;agentName:string|null;status:PaneStatus;sendable:boolean;disabledReason:DisabledReason;blockedReason:BlockedReason;usageLimitSuspected?:boolean;revision:number;availability:Availability}
export type TimelineItem={requestId:string;workspaceId:string;paneId:string;targetName:string;agentKind:string|null;promptText:string;status:TurnStatus;responseText:string|null;errorCode:string|null;createdAt:string;seq:number;completedAt:string|null}
