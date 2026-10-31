import type{PaneSummary}from'../domain/timeline-types.js'
export type UpstreamStatus=200|202|400|401|403|404|409|500|502|504
export type UpstreamResult<T>={ok:true;status:200|202;data:T}|{ok:false;status:UpstreamStatus;body:Record<string,unknown>}
export type PanesPayload={workspaceId:string;panes:PaneSummary[]}
