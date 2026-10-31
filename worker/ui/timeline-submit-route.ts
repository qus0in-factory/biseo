import{type App}from'./timeline-guards.js'
import{parseSubmit}from'./timeline-submit-parse.js'
import{submitContext}from'./timeline-submit-context.js'
import{submitReservation}from'./timeline-submit-reservation.js'
export function registerSubmitRoute(app:App){
 app.post('/api/timeline/messages',async c=>{
  const x=await submitContext(c);if(!x.ok)return x.res
  const p=await parseSubmit(c);if(!p.ok)return p.res
  return submitReservation(c,x.db,p.input,x.owner)
 })
}
