export const body = (id = 'r1', text = 'hi') => ({ requestId: id, workspaceId: 'w1T', paneId: 'w1T:p1', text })
export const queued = { requestId: 'r1', status: 'queued' }
