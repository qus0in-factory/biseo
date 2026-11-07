import{writeFileSync}from'node:fs'
import{resolve}from'node:path'
export function seedSelectedWorkspace(id:string){
 try{
  writeFileSync(resolve(process.cwd(),'config/workspace-selection.json'),
   JSON.stringify({workspaceId:id},null,2)+'\n',{encoding:'utf8',flag:'wx'})
 }catch(error){
  if((error as NodeJS.ErrnoException).code!=='EEXIST')throw error
 }
}
