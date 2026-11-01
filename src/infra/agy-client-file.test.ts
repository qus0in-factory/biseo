import test from 'node:test'
import assert from 'node:assert/strict'
import{mkdtempSync,rmSync,writeFileSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{readAgyClientIdFile,agyClientIdPath}from'./agy-client-file.js'
const withTemp=(run:(dir:string)=>void)=>{const dir=mkdtempSync(join(tmpdir(),'b-agy-'));try{run(dir)}finally{rmSync(dir,{recursive:true,force:true})}}
test('a missing client file reads as null',()=>withTemp((dir)=>{process.env.BISEO_AGY_CLIENT_ID_FILE=join(dir,'no-client');assert.equal(readAgyClientIdFile(),null)}))
test('a present client file reads trimmed',()=>withTemp((dir)=>{const p=join(dir,'client-id');writeFileSync(p,'synthetic-client-id\n',{mode:0o600});process.env.BISEO_AGY_CLIENT_ID_FILE=p;assert.equal(readAgyClientIdFile(),'synthetic-client-id')}))
test('the default path lives under protected storage',()=>{delete process.env.BISEO_AGY_CLIENT_ID_FILE;assert.match(agyClientIdPath(),/\.config\/biseo\/secrets\/agy-client-id$/)})
