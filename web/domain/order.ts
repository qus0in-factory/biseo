const clean=(v:unknown):string[]=>
 Array.isArray(v)?[...new Set(v.filter((x):x is string=>typeof x==='string'))]:[]
export const parseOrder=(raw:string|null):string[]=>{
 if(!raw)return[]
 try{return clean(JSON.parse(raw))}catch{return[]}
}
export const serializeOrder=(ids:string[]):string=>JSON.stringify(ids)
export const mergeOrder=(saved:string[],current:string[]):string[]=>{
 const live=new Set(current),kept=saved.filter(id=>live.has(id)),seen=new Set(kept)
 return [...kept,...current.filter(id=>!seen.has(id))]
}
export const sameOrder=(a:string[],b:string[]):boolean=>
 a.length===b.length&&a.every((id,i)=>id===b[i])
export const moveItem=(ids:string[],from:number,to:number):string[]=>{
 if(from===to||from<0||to<0||from>=ids.length||to>=ids.length)return ids
 const next=[...ids],[id]=next.splice(from,1)
 next.splice(to,0,id)
 return next
}
