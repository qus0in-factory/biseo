import type{TurnDeps}from'../app/turn-deps.js'
import type{PaneInfo}from'../domain/herdr.js'
import {workspaceIssue}from'../domain/workspace.js'
export async function renamePaneCheck(d:TurnDeps,id:string,name:unknown):Promise<{s:200|400|403|404|409|502;e:string;pane?:PaneInfo}>{
 if(typeof name!=='string'||!/^[A-Za-z0-9:_ -]{1,64}$/.test(name))return{s:400,e:'invalid_name'}
 const pane=await d.herdr.getPane(id).catch(()=>undefined)
 if(!pane)return{s:404,e:'pane_not_found'}
 const w=workspaceIssue(d.allowedWorkspaceId,pane.workspace_id)
 if(w)return{s:403,e:w}
 return{s:200,e:'',pane}
}
