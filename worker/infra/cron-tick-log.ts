export type TickStatus='ok'|'fail'|'skipped'
export type TickOutcome={status:TickStatus;code?:string}
export type TickStep=TickOutcome&{component:string;durationMs:number}
export type TickRows={rowsRead:number;rowsWritten:number}
export function logCronTick(steps:TickStep[],rows:TickRows,durationMs:number,requestId:string){
 const level=steps.some(s=>s.status==='fail')?'error':'info'
 console.log(JSON.stringify({msg:'worker.cron.tick',level,component:'cron',requestId,durationMs,rowsRead:rows.rowsRead,rowsWritten:rows.rowsWritten,steps}))
}
