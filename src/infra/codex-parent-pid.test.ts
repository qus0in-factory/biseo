import test from'node:test'
import assert from'node:assert/strict'
import {spawnSync}from'node:child_process'
import {mkdirSync,mkdtempSync,rmSync,writeFileSync}from'node:fs'
import {tmpdir}from'node:os'
import {join}from'node:path'
import {fileURLToPath}from'node:url'
const script=fileURLToPath(new URL('../../scripts/codex-parent-pid.sh',import.meta.url))
function fakePs(base:string,lines:string){
 const dir=join(base,'bin')
 mkdirSync(dir,{recursive:true})
 writeFileSync(join(dir,'ps'),`#!/bin/sh\ncase "$2:$4" in\n${lines}\nesac\n`,{mode:0o755})
 return dir
}
function run(base:string,ps:string,pid:string){
 return spawnSync('sh',[script,pid],{encoding:'utf8',env:{...process.env,PATH:fakePs(base,ps)+':'+process.env.PATH}})
}
test('walks parent pids to the nearest codex process',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-parent-'))
 try{
  const r=run(base,' comm=:111) echo sh;; ppid=:111) echo 222;; comm=:222) echo codex;;','111')
  assert.equal(r.status,0);assert.equal(r.stdout.trim(),'222')
 }finally{rmSync(base,{recursive:true,force:true})}
})
test('emits nothing when no codex ancestor exists',()=>{
 const base=mkdtempSync(join(tmpdir(),'biseo-parent-'))
 try{
  const r=run(base,' comm=:111) echo node;; ppid=:111) echo 222;; comm=:222) echo node;; ppid=:222) echo 1;;','111')
  assert.equal(r.status,0);assert.equal(r.stdout,'')
 }finally{rmSync(base,{recursive:true,force:true})}
})
