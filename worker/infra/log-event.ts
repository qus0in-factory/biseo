export const logEvent=(msg:string,requestId:string,t:number,x:object)=>
 console.log(JSON.stringify({msg,requestId,...x,durationMs:Date.now()-t}))
const CODE=/^[a-z0-9_]{1,40}$/
export const logCode=(v:unknown)=>typeof v==='string'&&CODE.test(v)?v:'unknown'
