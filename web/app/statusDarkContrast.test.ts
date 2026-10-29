import test from 'node:test'
import assert from 'node:assert/strict'
import { read } from './paneCss.js'
import { contrast } from './paneColor.js'
function B(c:string,s:string){const i=c.indexOf(s+' {');if(i<0)throw 0;return c.slice(i+s.length+2).split('}')[0]}
function V(c:string){return Object.fromEntries([...c.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]))}
function R(x:string,v:Record<string,string>):string{return x.replace(/var\(--([\w-]+)\)/g,(_,k:string)=>R(v[k]??'',v))}
const T=V(read('theme-tokens.css')),S=read('theme-status.css')
const L={...T,...V(B(S,':root'))},D={...T,...V(B(S,'.dark'))}
const C=(v:Record<string,string>,a:string,b:string)=>contrast(R(v[a],v),R(v[b],v))
test('x',()=>{for(const v of [L,D])for(const p of [['status-idle','color-surface'],['color-canvas','status-working'],['color-canvas','status-done'],['color-canvas','status-blocked'],['status-unknown-fg','color-surface']])assert.ok(C(v,p[0],p[1])>=4.5)})
