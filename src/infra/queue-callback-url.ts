export function queueCallbackUrl(
 server:{host:string;port:number},fileUrl?:string,envUrl?:string,
){
 if(envUrl!==undefined)return envUrl
 if(fileUrl!==undefined)return fileUrl
 const host=['0.0.0.0','::','[::]'].includes(server.host)?'127.0.0.1':server.host
 const address=host.includes(':')&&!host.startsWith('[')?`[${host}]`:host
 return `http://${address}:${server.port}/api/queue/completed`
}
