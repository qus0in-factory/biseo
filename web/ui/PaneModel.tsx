import type{PaneSummary}from'../domain/timeline'
import{ModelIcon}from'./ModelIcon'
import{modelFamily}from'../domain/modelFamily'
import r from'../resources.json'
import { useUsageStore } from '../app/useUsageStore'

export const paneModelLabel=(item:PaneSummary,pending:boolean)=>
 item.modelId?.trim()||(pending?r.usageMatching:r.modelUnknown)

export function PaneModel({item}:{item:PaneSummary}){
 const pending=useUsageStore(s=>s.status==='loading')
 const model=paneModelLabel(item,pending)
 return<>
  <ModelIcon family={modelFamily(item.modelId,item.modelProvider)}/>
  <small className="min-w-0 max-w-[45%] overflow-hidden text-ellipsis whitespace-nowrap text-xs text-muted-foreground" title={item.modelId??undefined}>{model}</small>
 </>
}
