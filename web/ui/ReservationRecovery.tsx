import type{TimelineItem}from'../domain/timeline'
import{useReservationRetry}from'../app/useReservationRetry'
import r from'../resources.json'
export function ReservationRecovery({item}:{item:TimelineItem}){
 const s=useReservationRetry(item)
 if(item.status!=='failed'||!['delivery_uncertain','target_unclear'].includes(item.errorCode??''))return null
 return <fieldset disabled={s.busy||s.done} className="mt-2 flex flex-col gap-2 text-sm">
  <p>{item.errorCode==='delivery_uncertain'?r.reservationDuplicateWarning:r.target_unclear}</p>
  <label>{r.reservationTarget}<input className="ml-2 rounded border px-2" value={s.pane} onChange={e=>s.setPane(e.target.value)}/></label>
  <button type="button" onClick={s.retry} disabled={!s.pane.trim()}>{r.reservationRetry}</button>
  <span role="status">{s.note}</span>
 </fieldset>
}
