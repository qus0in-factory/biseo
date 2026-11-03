import type{PaneSummary}from'../domain/timeline'
import{ModelIcon}from'./ModelIcon'
import{modelFamily}from'../domain/modelFamily'
export const paneModelLabel=(item:PaneSummary)=>item.modelId?.trim()||null

export function PaneModel({item}:{item:PaneSummary}){
 const model=paneModelLabel(item)
 if(!model)return null
 return<>
  <ModelIcon family={modelFamily(item.modelId,item.modelProvider)}/>
  <small className="min-w-0 max-w-[45%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground" title={item.modelId??undefined}>{model}</small>
 </>
}
