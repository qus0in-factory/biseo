import{lstat,readdir}from'node:fs/promises'
import{homedir}from'node:os'
import{join}from'node:path'
export async function findLatestRollout():Promise<string|null>{
 const root=process.env.BISEO_CODEX_DIR??join(homedir(),'.codex','sessions')
 const y=await readdir(root).then(a=>a.filter(s=>/^\d{4}$/.test(s)).sort()).catch(()=>[])
 if(!y.length)return null
 const yPath=join(root,y[y.length-1])
 const m=await readdir(yPath).then(a=>a.filter(s=>/^\d{2}$/.test(s)).sort()).catch(()=>[])
 if(!m.length)return null
 const mPath=join(yPath,m[m.length-1])
 const d=await readdir(mPath).then(a=>a.filter(s=>/^\d{2}$/.test(s)).sort()).catch(()=>[])
 if(!d.length)return null
 const dPath=join(mPath,d[d.length-1])
 const fs=await readdir(dPath).then(a=>a.filter(s=>s.endsWith('.jsonl')).sort()).catch(()=>[])
 for(let i=fs.length-1;i>=0;i--){
  const p=join(dPath,fs[i])
  if(await lstat(p).then(s=>s.isFile()).catch(()=>false))return p
 }
 return null
}
