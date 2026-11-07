import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
import {readSelectedWorkspace} from './workspace-selection.js'
import {workspaceState} from './workspace-state.js'
const runtimePath=resolve(process.cwd(),'config/runtime.json')
export function readWorkspace(file=runtimePath,legacyOnly=false):string|undefined {
 if(!legacyOnly&&file===runtimePath){
  if(workspaceState.resolved)return workspaceState.id
  const selected=readSelectedWorkspace()
  if(selected) return selected
 }
 try {
  const id=JSON.parse(readFileSync(file,'utf8')).allowedWorkspaceId
  return typeof id==='string'&&/^[A-Za-z0-9:_-]+$/.test(id)?id:undefined
 } catch { return undefined }
}
