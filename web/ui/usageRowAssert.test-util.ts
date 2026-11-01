import assert from'node:assert/strict'
export const DAY=86_400_000
export const fromNow=(days:number)=>new Date(Date.now()+days*DAY).toISOString()
export const percentMetric=(resetsAt:string|null)=>({id:'secondary',label:'secondary',unit:'percent',used:48,limit:100,remaining:52,resetsAt})
export const percentValue=(resetsAt:string|null)=>({window:'secondary',usedPercent:48,resetsAt,checkedAt:null,limitReached:false,source:null})
export const assertFixedValueColumns=(out:string)=>{
 assert.match(out,/min-w-16/)
 assert.match(out,/w-16 shrink-0/)
 assert.match(out,/items-baseline/)
 assert.equal((out.match(/class="[^"]*text-right[^"]*"/g)??[]).length,2)
}
