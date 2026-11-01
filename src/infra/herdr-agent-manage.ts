import {call} from './herdr-exec.js'
export async function startAgent(name:string,kind:string,paneId:string,args:string[]=[]){
 const a=['agent','start',name,'--kind',kind,'--pane',paneId]
 if(args.length){a.push('--');a.push(...args)}
 await call(a,30000)
}
export async function renameAgent(target:string,name:string){await call(['agent','rename',target,name],15000)}
