import type {PaneStatus} from './timeline.js'
export type AgentSession={source:string;agent:string;kind:'id'|'path';value:string}
export type PaneInfo={pane_id:string;tab_id:string;workspace_id:string;terminal_id:string;agent_status:PaneStatus;agent?:string|null;label?:string|null;title?:string|null;terminal_title_stripped?:string|null;agent_session?:AgentSession|null;cwd?:string;revision:number}
export type AgentInfo={pane_id:string;terminal_id:string;agent_status:PaneStatus;agent?:string|null;name?:string|null;display_agent?:string|null;agent_session?:AgentSession|null;interactive_ready?:boolean;launch_pending?:boolean;revision:number}
