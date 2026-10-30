import{useState}from'react'
import{UsageOrderItem}from'./UsageOrderItem'
import{resolveUsageIds,moveUsageIdTo}from'../domain/usageOrder'
import r from'../resources.json'
export function UsageOrderSection({providers,orderState}:any){
const ids=resolveUsageIds(orderState.order,providers.map((p:any)=>p.provider))
const[e,setE]=useState(false)
const[d,setD]=useState(ids)
const[g,setG]=useState<any>(null)
if(!e)return<button type="button" onClick={()=>{setD(ids);setE(true)}}>{r.usageEditOrder}</button>
return(<div><ul>{d.map((id:any)=>(<UsageOrderItem key={id} id={id} hidden={orderState.hidden.includes(id)} draggable onDragStart={()=>setG(id)} onDragOver={(ev:any)=>{ev.preventDefault();if(g&&g!==id)setD(moveUsageIdTo(d,g,d.indexOf(id)))}} onDragEnd={()=>setG(null)} onToggleHide={()=>orderState.toggleHide(id)}/>))}</ul><button type="button" onClick={()=>{orderState.setOrder(d);setE(false)}}>{r.status_done}</button><button type="button" onClick={()=>setE(false)}>{r.cancel}</button></div>)
}