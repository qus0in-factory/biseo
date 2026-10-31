import {readFileSync,writeFileSync} from 'node:fs'
import {resolve} from 'node:path'
const selectionPath=resolve(process.cwd(),'config/workspace-selection.json')
function valid(id:unknown):id is string {
 return typeof id==='string'&&/^[A-Za-z0-9:_-]+$/.test(id)
}
export function readSelectedWorkspace(file=selectionPath):string|undefined {
 try {
  const v=JSON.parse(readFileSync(file,'utf8'))
  const id=v?.workspaceId??v?.allowedWorkspaceId??v?.id??v?.selectedWorkspaceId
  return valid(id)?id:undefined
 } catch { return undefined }
}
export function writeSelectedWorkspace(id:string,file=selectionPath):void {
 if(!valid(id)) throw new Error('workspace_not_allowed')
 writeFileSync(file,JSON.stringify({workspaceId:id},null,2)+'\n','utf8')
}