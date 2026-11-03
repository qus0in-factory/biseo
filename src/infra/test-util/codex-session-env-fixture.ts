import{mkdir,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
export async function fakePs(base:string,out='codex'){
 const dir=join(base,'psbin'),f=join(dir,'ps')
 await mkdir(dir,{recursive:true});await writeFile(f,`#!/bin/sh\necho '${out}'\n`,{mode:0o755})
 process.env.PATH=dir+':'+process.env.PATH
}
export async function env(base:string,root:string){
 process.env.BISEO_STATE_DIR=join(base,'state');process.env.BISEO_CODEX_DIR=root
 await mkdir(join(base,'state','codex'),{recursive:true})
}
export function restore(old:(string|undefined)[]){
 if(old[0]===undefined)delete process.env.BISEO_STATE_DIR;else process.env.BISEO_STATE_DIR=old[0]
 if(old[1]===undefined)delete process.env.BISEO_CODEX_DIR;else process.env.BISEO_CODEX_DIR=old[1]
 if(old[2]===undefined)delete process.env.PATH;else process.env.PATH=old[2]
}
export{tmpdir,join}
