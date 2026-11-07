import type{PaneInfo}from'../domain/herdr.js'
export type Owned={alias:string;label:string}
export function prepareLabels(mine:Map<string,Owned>,panes:PaneInfo[]){
 const ids=new Set(panes.map(p=>p.pane_id))
 for(const id of mine.keys())if(!ids.has(id))mine.delete(id)
 return new Set(panes.map(p=>p.label).filter((l):l is string=>!!l))
}
