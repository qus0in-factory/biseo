export const pageLimit=(v:string|undefined)=>{
 const n=Math.trunc(Number(v))
 return Number.isFinite(n)?Math.min(Math.max(n,1),50):20
}
export const pageBefore=(v:string|undefined)=>{
 if(v==null||v==='')return null
 const n=Number(v)
 return Number.isInteger(n)&&n>0?n:null
}
