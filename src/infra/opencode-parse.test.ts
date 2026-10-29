import test from'node:test'
import assert from'node:assert/strict'
import {parseTurn as parse}from'./opencode-parse.js'
const r=(type:string,d:unknown)=>({type,data:JSON.stringify(d)})
test('parseTurn collects assistant text until succeeded idle and rejects failures',()=>{
 const u=r('user',{text:' ask '}),a1=r('assistant',{content:[{type:'reasoning',text:'r'},{type:'text',text:'p1'}]})
 const a2=r('assistant',{content:[{type:'tool',name:'t'},{type:'text',text:'p2'}]})
 assert.deepEqual(parse([u,a1,a2],'ask'),{done:false,text:null})
 assert.deepEqual(parse([u,a1,a2,r('idle',{outcome:'succeeded'})],'ask'),{done:true,text:'p1\n\np2'})
 assert.deepEqual(parse([u,a1,r('idle',{outcome:'failed'})],'ask'),{done:true,text:null})
 assert.deepEqual(parse([u,a1,r('user',{text:'next'})],'ask'),{done:true,text:null})
})
