import {after}from'node:test'
import assert from'node:assert/strict'
import {copyFileSync,mkdtempSync,mkdirSync,readFileSync,rmSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
export function workspaceSandbox(){
 const cwd=process.cwd(),file=join(cwd,'config/workspace-selection.json')
 const read=()=>{try{return readFileSync(file,'utf8')}catch{return undefined}}
 const before=read(),dir=mkdtempSync(join(tmpdir(),'biseo-workspace-'))
 mkdirSync(join(dir,'config'))
 copyFileSync(join(cwd,'config/runtime.json'),join(dir,'config/runtime.json'))
 process.chdir(dir)
 after(()=>{
  process.chdir(cwd)
  try{assert.equal(read(),before,'real workspace selection must remain unchanged')}
  finally{rmSync(dir,{recursive:true,force:true})}
 })
 return join(dir,'config/workspace-selection.json')
}
