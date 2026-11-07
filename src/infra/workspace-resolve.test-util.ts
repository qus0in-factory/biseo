import{mkdtempSync,mkdirSync,writeFileSync,rmSync}from'node:fs'
import{tmpdir}from'node:os'
import{join}from'node:path'
import{after}from'node:test'
export function sandbox(){
 const cwd=process.cwd(),env={...process.env},dir=mkdtempSync(join(tmpdir(),'resolve-'))
 mkdirSync(join(dir,'config'))
 process.chdir(dir)
 delete process.env.ALLOWED_WORKSPACE_ID
 delete process.env.HERDR_WORKSPACE_ID
 const put=(file:string,value:unknown)=>writeFileSync(file,JSON.stringify(value))
 put('config/runtime.json',{})
 const bin=join(dir,'herdr')
 writeFileSync(bin,'#!/bin/sh\necho \'{"result":{"workspaces":[{"workspace_id":"focused","focused":true}]}}\'\n',{mode:0o700})
 process.env.HERDR_BIN_PATH=bin
 after(()=>{process.chdir(cwd);process.env=env;rmSync(dir,{recursive:true,force:true})})
 return put
}
