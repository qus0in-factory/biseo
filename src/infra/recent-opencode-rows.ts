import{DatabaseSync}from'node:sqlite'
import{existsSync}from'node:fs'
import{opencodePath}from'./opencode-db.js'
import type{Row}from'./opencode-parse.js'
export function recentOpencodeRows(id:string){
 const path=opencodePath()
 if(!existsSync(path))return null
 const db=new DatabaseSync(path,{readOnly:true})
 try{
  return db.prepare('SELECT type,data FROM session_message WHERE session_id=? ORDER BY seq').all(id)as Row[]
 }finally{db.close()}
}
