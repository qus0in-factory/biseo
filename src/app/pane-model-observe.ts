import{modelDisplay}from'../domain/pane-model-line.js'
import{parseModelDisplay,type PaneModel}from'../domain/pane-model-parse.js'
import type{HerdrPort}from'./ports.js'
export async function observePaneModel(
 h:HerdrPort,paneId:string,kind:string|null,
):Promise<PaneModel|null>{
 if(!kind||!['opencode','agy','claude'].includes(kind)||!h.readRecent)return null
 try{
  const lines=await h.readRecent(paneId,8,kind==='opencode'?'recent-unwrapped':'visible')
  const display=modelDisplay(lines,kind)
  return display?parseModelDisplay(display,kind):null
 }catch{
  return null
 }
}
