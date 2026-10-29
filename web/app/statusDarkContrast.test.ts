import test from 'node:test'
import assert from 'node:assert/strict'
import { read } from './paneCss.js'
import { contrast } from './paneColor.js'
function B(c:string,s:string){const i=c.indexOf(s+' {');if(i<0)throw new Error();return c.slice(i+s.length+2).split('}')[0]}
function V(c:string):Record<string,string>{return Object.fromEntries([...c.matchAll(/--([\w-]+):([^;]+);/g)].map(m=>[m[1],m[2].trim()]))}
function R(x:string,v:Record<string,string>):string{return x.replace(/var\(--([\w-]+)\)/g,(_,k:string)=>R(v[k]??'',v))}
test('d',()=>{const v={...V(read('theme-tokens.css')), ...V(B(read('theme-semantic.css'),'.dark')), ...V(B(read('theme-status.css'),'.dark'))}
const sd=R(v['color-surface-dark'],v),cv=R(v['color-canvas'],v)
assert.ok(contrast(R(v['status-idle'],v),sd)>=4.5&&contrast(cv,R(v['status-working'],v))>=4.5&&contrast(cv,R(v['status-done'],v))>=4.5&&contrast(cv,R(v['status-blocked'],v))>=4.5&&contrast(R(v['color-primary'],v),R(v['color-surface'],v))>=4.5)})
