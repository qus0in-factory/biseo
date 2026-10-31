import {useContext,useState} from 'react'
import type {TimelineItem} from '../domain/timeline'
import {retryReservation} from '../infra/retryReservation'
import r from '../resources.json'
import{ReservationRefresh}from'./reservationRefresh'
export function useReservationRetry(item:TimelineItem){
 const refresh=useContext(ReservationRefresh)
 const [pane,setPane]=useState(item.paneId)
 const [busy,setBusy]=useState(false),[note,setNote]=useState('')
 const [done,setDone]=useState(false)
 const retry=async()=>{
  if(busy||done||!pane.trim())return
  setBusy(true);setNote('')
  try{await retryReservation(item,pane.trim());setDone(true);setNote(r.reservationRetryAccepted);refresh?.()}
  catch{setNote(r.reservationRetryFailed)}
  finally{setBusy(false)}
 }
 return{pane,setPane,busy,done,note,retry}
}
