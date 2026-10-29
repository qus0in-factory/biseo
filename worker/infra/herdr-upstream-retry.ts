import ky,{type Options}from'ky'
type M='GET'|'POST'
const log=(id:string,m:string,p:string,n:number)=>console.log(JSON.stringify({msg:'worker.upstream.retry',requestId:id,method:m,path:p,retryCount:n}))
export const upstreamRetry=(id:string,m:M,p:string):Pick<Options,'retry'|'hooks'>=>m==='GET'
 ?{retry:{limit:2,methods:['get'],retryOnTimeout:true},hooks:{beforeRetry:[({retryCount})=>{log(id,m,p,retryCount)}],afterResponse:[({response,retryCount})=>response.status>=500&&retryCount<2?ky.retry():undefined]}}
 :{retry:0}
