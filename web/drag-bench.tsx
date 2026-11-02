import{useState,useEffect}from'react'
import{createRoot}from'react-dom/client'
import{PaneSortableList}from'./ui/PaneSortableList'
import type{PaneSummary}from'./domain/timeline'

const n=()=>{}
const mk=(p:string):PaneSummary=>({paneId:p,tabId:'t',name:p,agentKind:null,agentName:null,status:'idle',sendable:true,disabledReason:null,blockedReason:null,revision:1})

export function DragBench(){
 const[panes,setPanes]=useState([mk('1'),mk('2'),mk('3')])
 useEffect(()=>{
  const id=setInterval(()=>setPanes(p=>p.map(x=>({...x}))),200)
  return()=>clearInterval(id)
 },[])
 const move=(from:number,to:number)=>{
  setPanes(prev=>{
   let l=[...prev],[x]=l.splice(from,1)
   l.splice(to,0,x)
   return l
  })
 }
 return <div className="p-5">
  <div id="order-ids">{panes.map(p=>p.paneId).join(',')}</div>
  <PaneSortableList panes={panes} selectedId="1" onSelect={n} register={()=>n} onMove={move}/>
 </div>
}

createRoot(document.getElementById('root')!).render(<DragBench/>)
