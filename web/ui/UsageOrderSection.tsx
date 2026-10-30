import{useState}from'react'
import{resolveUsageIds,moveUsageIdTo}from'../domain/usageOrder'
import r from'../resources.json'
export function UsageOrderSection({providers,orderState}:any){
const ids=resolveUsageIds(orderState.order,providers.map((p:any)=>p.provider))
const[e,setE]=useState(false)
const[d,setD]=useState(ids)
const[g,setG]=useState<string|null>(null)
if(!e)return<button type="button"onClick={()=>{setD(ids);setE(true)}}>{r.usageEditOrder}</button>
return(<div><ul>{d.map((id:string)=>(<li key={id}draggable onDragStart={()=>setG(id)}onDragOver={(ev:any)=>{ev.preventDefault();if(g&&g!==id)setD(moveUsageIdTo(d,g,d.indexOf(id)))}}onDragEnd={()=>setG(null)}>{id}</li>))}</ul><button type="button"onClick={()=>{orderState.setOrder(d);setE(false)}} title={r.usageEditOrderDone}>{r.status_done}</button><button type="button"onClick={()=>setE(false)} title={r.usageEditOrderCancel}>{r.cancel}</button></div>)
}
