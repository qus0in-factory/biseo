import {readFileSync} from 'node:fs'
import {resolve} from 'node:path'
export function readWorkspace(file=resolve(process.cwd(),'config/runtime.json')):string|undefined {
 try {
  const id=JSON.parse(readFileSync(file,'utf8')).allowedWorkspaceId
  return typeof id==='string'&&/^[A-Za-z0-9:_-]+$/.test(id)?id:undefined
 } catch { return undefined }
}
