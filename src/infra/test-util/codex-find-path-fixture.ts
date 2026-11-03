import{mkdir,mkdtemp,rm,symlink,writeFile}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
export const id='aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee'
export const linkId='bbbbbbbb-cccc-4ddd-8eee-ffffffffffff'
export const dirId='cccccccc-dddd-4eee-8fff-000000000000'
export async function setup(){
 const root=await mkdtemp(join(tmpdir(),'biseo-path-'))
 const prev=process.env.BISEO_CODEX_DIR
 const sub=join(root,'2026','10','29')
 await mkdir(sub,{recursive:true})
 const file=join(sub,`rollout-x-${id}.jsonl`)
 await writeFile(file,'')
 await symlink('/etc/hosts',join(sub,`rollout-x-${linkId}.jsonl`))
 await mkdir(join(sub,`rollout-x-${dirId}.jsonl`))
 process.env.BISEO_CODEX_DIR=root
 return{root,file,prev}
}
export async function teardown(c:any){
 if(c.prev===undefined)delete process.env.BISEO_CODEX_DIR
 else process.env.BISEO_CODEX_DIR=c.prev
 await rm(c.root,{recursive:true,force:true})
}
