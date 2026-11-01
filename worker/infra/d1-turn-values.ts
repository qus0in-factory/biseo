import type{TurnRecord}from'../domain/timeline-record.js'
export const turnValues=(r:TurnRecord)=>[
 r.requestId,r.workspaceId,r.ownerSubject,r.paneId,r.targetName,
 r.agentKind,r.promptText,r.status,r.responseText,r.errorCode,
 r.createdAt,r.updatedAt,r.completedAt,r.terminalId??null,
]
