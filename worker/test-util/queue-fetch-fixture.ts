export function queueFetch(sent:()=>void,ready=false,executeStatus=202){
 return async(u:any)=>{
  const url=typeof u==='string'?u:u.url
  if(url.includes('/panes/'))return Response.json({terminalId:'t1',ready})
  sent()
  return Response.json({status:'working'},{status:executeStatus})
 }
}
