import assert from'node:assert/strict'
export const DAY=86_400_000
export const fromNow=(days:number)=>new Date(Date.now()+days*DAY).toISOString()
export const percentMetric=(resetsAt:string|null)=>({id:'secondary',label:'secondary',unit:'percent',used:48,limit:100,remaining:52,resetsAt})
export const percentValue=(resetsAt:string|null)=>({window:'secondary',usedPercent:48,resetsAt,checkedAt:null,limitReached:false,source:null})
export const assertFixedValueColumns=(out:string)=>{
 assert.match(out,/grid-cols-\[minmax\(0,1fr\)_4\.25rem_4\.75rem\]/)
 assert.match(out,/items-center gap-x-3/)
 assert.match(out,/text-right text-base font-medium tabular-nums/)
 assert.match(out,/justify-end text-right text-sm tabular-nums/)
 assert.equal((out.match(/text-right/g)??[]).length,2)
 assert.doesNotMatch(out,/font-mono|min-w-16|w-16 shrink-0|items-baseline/)
 assert.match(out,/py-1\.5/)
 assert.doesNotMatch(out,/border-t|border-border/)
}
