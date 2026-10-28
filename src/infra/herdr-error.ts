export class HerdrError extends Error{constructor(readonly code:string){super(code)}}
export function errorCodeOf(e:unknown):string{
 const x=e as{code?:unknown;stderr?:string;killed?:boolean}
 if(x.killed)return 'timeout'
 try{
  const j=JSON.parse(String(x.stderr??''))
  const c=j?.error?.code??j?.code
  if(typeof c==='string')return c
 }catch{}
 return typeof x.code==='string'?x.code:'herdr_error'
}
export const notFound=(e:unknown)=>e instanceof HerdrError&&/not_found$/.test(e.code)
