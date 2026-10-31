import r from'../resources.json'
type P={p:{paneId:string;name:string};busy:boolean;confirmId:string|null;setConfirmId:(v:string|null)=>void;onClose:(id:string)=>void}
export function PaneManageCloseControls(x:P){
 const p=x.p
 if(x.confirmId===p.paneId) return(
  <>
   <span>{r.confirmClose}</span>
   <button type="button" onClick={()=>void x.onClose(p.paneId)} disabled={x.busy}>{r.confirm}</button>
   <button type="button" onClick={()=>x.setConfirmId(null)} disabled={x.busy}>{r.cancel??'취소'}</button>
  </>
 )
 return <button type="button" onClick={()=>x.setConfirmId(p.paneId)} disabled={x.busy}>{r.closePane}</button>
}
