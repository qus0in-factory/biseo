import r from'../resources.json'
type P={p:{paneId:string;name:string};busy:boolean;renameId:string|null;renameName:string;setRenameId:(v:string|null)=>void;setRenameName:(v:string)=>void;onRename:(id:string)=>void}
export function PaneManageRenameControls(x:P){
 const p=x.p
 if(x.renameId===p.paneId) return(
  <>
   <input value={x.renameName} onChange={e=>x.setRenameName(e.target.value)} disabled={x.busy}/>
   <button type="button" onClick={()=>void x.onRename(p.paneId)} disabled={x.busy}>{r.confirm}</button>
   <button type="button" onClick={()=>x.setRenameId(null)} disabled={x.busy}>{r.cancel??'취소'}</button>
  </>
 )
 return <button type="button" onClick={()=>{x.setRenameId(p.paneId);x.setRenameName(p.name)}} disabled={x.busy}>{r.renamePane}</button>
}
