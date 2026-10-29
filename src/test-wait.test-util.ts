export const wait=(ms:number)=>new Promise<void>(r=>setTimeout(r,ms))
export const until=async(cond:()=>boolean,timeoutMs=2000,intervalMs=10):Promise<void>=>{
 const end=Date.now()+timeoutMs
 while(!cond()&&Date.now()<end)await new Promise<void>(r=>setTimeout(r,intervalMs))
}