import{mkdir,mkdtemp}from'node:fs/promises'
import{tmpdir}from'node:os'
import{join}from'node:path'
export async function setupHerdrCliEnv(){
 const base=await mkdtemp(join(tmpdir(),'biseo-herdr-')),state=join(base,'state'),root=join(base,'sessions'),bin=join(base,'herdr'),psdir=join(base,'ps')
 await mkdir(join(state,'codex'),{recursive:true});await mkdir(root,{recursive:true});await mkdir(psdir,{recursive:true})
 const old=[process.env.HERDR_BIN_PATH,process.env.BISEO_STATE_DIR,process.env.BISEO_CODEX_DIR,process.env.PATH]
 process.env.HERDR_BIN_PATH=bin;process.env.BISEO_STATE_DIR=state;process.env.BISEO_CODEX_DIR=root;process.env.PATH=psdir+':'+process.env.PATH
 return{base,state,root,bin,psdir,old}
}
