import type {PinLoginDeps} from './pin-login-types.js'
export async function reservePin(d:PinLoginDeps,scope:string,now:number){
 const base={windowSeconds:d.limits.windowSeconds,lockSeconds:d.limits.lockSeconds}
 const ip=await d.attempts.reserve(scope,{...base,max:d.limits.max},now)
 if(ip>d.limits.max)return{ok:false,status:429} as const
 const global=await d.attempts.reserve('global',{...base,max:d.limits.globalMax},now)
 if(global>d.limits.globalMax)return{ok:false,status:429} as const
 const status=ip>=d.limits.max||global>=d.limits.globalMax?429:401
 return{ok:true,denied:{ok:false,status}} as const
}
