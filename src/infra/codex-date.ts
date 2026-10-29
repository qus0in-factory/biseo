import{lstat,readdir}from'node:fs/promises'
import{join}from'node:path'
const v7=/^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[0-9a-f]{4}-[0-9a-f]{12}$/
const p2=(n:number)=>String(n).padStart(2,'0')
export function dateDirs(id:string):string[]{
 if(!v7.test(id))return[]
 const ms=parseInt(id.slice(0,8)+id.slice(9,13),16)
 return[0,-1,1].map(n=>{const d=new Date(ms+n*864e5);return`${d.getFullYear()}/${p2(d.getMonth()+1)}/${p2(d.getDate())}`})
}
export async function inDateDirs(root:string,id:string):Promise<string|null>{
 const want=`-${id}.jsonl`
 for(const dir of dateDirs(id)){
  const names=await readdir(join(root,dir)).catch(()=>[] as string[])
  for(const n of names.filter(n=>n.endsWith(want)).sort().reverse()){
   const p=join(root,dir,n)
   if(await lstat(p).then(s=>s.isFile()).catch(()=>false))return p
  }
 }
 return null
}
