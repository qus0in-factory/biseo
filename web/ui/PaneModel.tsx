import type{PaneSummary}from'../domain/timeline'
import{ModelIcon}from'./ModelIcon'
import{modelFamily}from'../domain/modelFamily'
import r from'../resources.json'

export function PaneModel({item}:{item:PaneSummary}){
 const model=item.modelId?.trim()||r.modelUnknown
 return<>
  <ModelIcon family={modelFamily(item.modelId,item.modelProvider)}/>
  <small className="min-w-0 max-w-[45%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground" title={item.modelId??undefined}>{model}</small>
 </>
}
