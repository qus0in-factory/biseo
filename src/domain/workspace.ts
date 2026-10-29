export function workspaceIssue(allowed:string|undefined,ws:string):'workspace_not_configured'|'workspace_not_allowed'|null{
 if(!allowed)return 'workspace_not_configured'
 if(!/^[A-Za-z0-9:_-]+$/.test(ws))return 'workspace_not_allowed'
 return allowed===ws?null:'workspace_not_allowed'
}
