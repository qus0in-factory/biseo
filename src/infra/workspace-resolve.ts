import{workspaceSources}from'./workspace-sources.js'
import{writeSelectedWorkspace}from'./workspace-selection.js'
import{logger}from'./logger.js'
import{workspaceState}from'./workspace-state.js'
export{readWorkspace}from'./workspace-config.js'
export async function resolveWorkspace(sources=workspaceSources(),save=writeSelectedWorkspace,log=logger){
 const tried:string[]=[]
 for(const [name,read]of sources){
  tried.push(name)
  let id:unknown
  try{id=await read()}catch{continue}
  if(typeof id!=='string'||!/^[A-Za-z0-9:_-]+$/.test(id))continue
  workspaceState.id=id
  workspaceState.resolved=true
  try{save(id)}catch{log.warn({sources:[name]},'workspace.persist_failed')}
  return id
 }
 workspaceState.id=undefined
 workspaceState.resolved=true
 log.warn({sources:tried},'workspace.unresolved')
 return undefined
}
