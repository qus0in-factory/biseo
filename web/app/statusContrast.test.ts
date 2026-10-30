import test from 'node:test'
import assert from 'node:assert/strict'
import { read } from './paneCss.js'
import { contrast } from './paneColor.js'
const B=(c:string,s:string)=>{const i=c.indexOf(`${s} {`);if(i<0)throw Error(s);return c.slice(i+s.length+2).split('}')[0]}
const V=(c:string)=>Object.fromEntries([...c.matchAll(/--([\w-]+):\s*([^;]+);/g)].map(m=>[m[1],m[2].trim()]))
const R=(x:string,v:Record<string,string>):string=>x.replace(/var\(--([\w-]+)\)/g,(_,k:string)=>R(v[k]??'',v))
const T={...V(read('theme-tokens.css')),...V(B(read('theme-status.css'),':root'))}
const C=(a:string,b:string)=>contrast(R(T[a],T),R(T[b],T))
test('light status contrast',()=>{for(const p of [['status-idle','color-surface'],['color-canvas','status-working'],['color-canvas','status-done'],['color-canvas','status-blocked'],['status-unknown-fg','color-surface']])assert.ok(C(p[0],p[1])>=4.5)})
