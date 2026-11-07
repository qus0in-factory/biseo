import type{HerdrPort}from'./ports.js'
import type{PaneInfo}from'../domain/herdr.js'
export type LabelWarn=(f:{id:string;command:string},msg:string)=>void
export async function renameLabels(h:HerdrPort,p:PaneInfo,panes:PaneInfo[],label:string,warn:LabelWarn){
 const step=async(command:string,id:string,run:()=>Promise<void>|undefined)=>{try{await run()}catch{warn({id,command},'auto_label.rename_failed')}}
 await step('pane rename',p.pane_id,()=>h.renamePane!(p.pane_id,label))
 await step('agent rename',p.pane_id,()=>h.renameAgent?.(p.pane_id,label))
 if(h.renameTab&&panes.filter(x=>x.tab_id===p.tab_id).length===1)await step('tab rename',p.tab_id,()=>h.renameTab!(p.tab_id,label))
}
