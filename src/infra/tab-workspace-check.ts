import type{HerdrPort}from'../app/ports.js'
export async function checkTabWorkspace(h:HerdrPort,id:string,ws?:string){
 if(ws){
  if(h.getTab){
   const tab=await h.getTab(id).catch(()=>undefined)
   if(tab?.workspace_id===ws)return
  }else{
   const panes=await h.listPanes(ws).catch(()=>[])
   if(panes.some(p=>p.tab_id===id))return
  }
 }
 throw Object.assign(new Error('workspace_not_allowed'),{code:'workspace_not_allowed'})
}
