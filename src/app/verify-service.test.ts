import test from 'node:test'
import assert from 'node:assert/strict'
import{createVerifyService as m,ServiceAuthError as E}from'./verify-service.js'
const p={issuer:'biseo',audience:'biseo-service'}
const n=Date.now()
const iso=(d:number)=>new Date(d).toISOString()
const b={iss:'biseo',aud:'biseo-service',sub:'s',purpose:'service',iat:iso(n),exp:iso(n+6e4)}
const stub={verify:async(t:string)=>{
if(t==='ok')return b
if(t==='a')return{...b,aud:'x'}
if(t==='u')return{...b,purpose:'user-session'}
if(t==='e')return{...b,exp:iso(n-6e4)}
if(t==='f')return{...b,iat:iso(n+6e4)}
if(t==='s')return{...b,sub:''}
throw new Error('bad')}}
const is=(s:number)=>(e:unknown)=>e instanceof E&&e.status===s
test('401',async()=>{
const v=m(stub,p)
for(const t of[undefined,'bad','e','f','s'])await assert.rejects(()=>v(t as string),is(401))})
test('403+ok',async()=>{
const v=m(stub,p)
await assert.rejects(()=>v('a'),is(403))
await assert.rejects(()=>v('u'),is(403))
await v('ok')})
