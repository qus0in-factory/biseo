import{mkdirSync,writeFileSync}from'node:fs'
import{join}from'node:path'
export function fakeHerdr(base:string,body:string){
 const dir=join(base,'bin'),f=join(dir,'herdr')
 mkdirSync(dir,{recursive:true})
 writeFileSync(f,`#!/bin/sh\ncase "$1 $2" in\n${body}\n  *) echo '{}';;\nesac\n`,{mode:0o755})
 return f
}
export{join}