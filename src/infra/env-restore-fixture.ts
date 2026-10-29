export function restoreEnv(old:any,keys:string[]){
 old.forEach((v:string|undefined,i:number)=>{if(v===undefined)delete (process.env as any)[keys[i]];else (process.env as any)[keys[i]]=v})
}
