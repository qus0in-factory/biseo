import{homedir}from'node:os'
import{join}from'node:path'
import{DatabaseSync}from'node:sqlite'
export function opencodePath(){return process.env.BISEO_OPENCODE_DB||join(homedir(),'.local/share/opencode/opencode.db')}
export function opencodeDb<T>(p:string,f:(d:DatabaseSync)=>T){
 try{const d=new DatabaseSync(p,{readOnly:true});try{return f(d)}finally{d.close()}}catch{return null}
}
