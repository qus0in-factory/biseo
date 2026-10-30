import type{PaneSummary}from'../domain/timeline'
import type{AsyncState}from'../domain/asyncState'
import{listState}from'../domain/asyncListState'
import{usePanesView}from'./usePanesView'
import{PanesList}from'./PanesList'
import{AsyncList}from'./AsyncList'
import{ListSkeleton}from'./ListSkeleton'
import r from'../resources.json'
type P={panes:PaneSummary[];selectedId:string|null;onSelect:(id:string)=>void;storageKey?:string;state?:AsyncState<PaneSummary[]>;onRetry?:()=>void}
export function PanesView(p:P){
 const view=usePanesView(p)
 const state=p.state??listState(p.panes,false,null)
 return(
  <AsyncList state={state} skeleton={<ListSkeleton rows={4}/>} empty={<p className="text-sm text-muted-foreground">{r.emptyPanes}</p>} errorText={r.panesError} onRetry={p.onRetry}>
   {()=>view?<PanesList view={view} selectedId={p.selectedId} onSelect={p.onSelect}/>:null}
  </AsyncList>
 )
}
