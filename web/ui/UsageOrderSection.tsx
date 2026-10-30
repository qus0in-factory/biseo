import{useState}from'react'
import{UsageOrderItem}from'./UsageOrderItem'
import{resolveUsageIds,moveUsageIdTo}from'../domain/usageOrder'
import r from'../resources.json'
export function UsageOrderSection({providers,orderState}:any){
const ids=resolveUsageIds(orderState.order,providers.map((p:any)=>p.provider))
const[e,setE]=useState(false)
const[d,setD]=useState(ids)
const[g,setG]=useState<any>(null)
const o=orderState
if(!e)return<button onClick={()=>{setD(ids);setE(true)}}>{r.usageEditOrder}</button>
return(<div><ul>{d.map((id:any)=>(<UsageOrderItem key={id} id={id} hidden={o.hidden.includes(id)} draggable onDragStart={()=>setG(id)} onDragOver={(ev:any)=>{ev.preventDefault();if(g&&g!==id)setD(moveUsageIdTo(d,g,d.indexOf(id)))}} onDragEnd={()=>setG(null)} onToggleHide={()=>o.toggleHide(id)}/>))}</ul><button title={r.usageEditOrderDone} onClick={()=>{orderState.setOrder(d);setE(false)}}>{r.status_done}</button><button title={r.usageEditOrderCancel} onClick={()=>setE(false)}>{r.cancel}</button></div>)
}
