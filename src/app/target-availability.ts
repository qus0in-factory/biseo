import{normalizeAvailability,unknownAvailability}from'../domain/availability.js'
import type{Availability}from'../domain/timeline.js'
import type{Target}from'../domain/turn-policy.js'
import type{TurnDeps}from'./turn-deps.js'
export async function targetAvailability(d:TurnDeps,t:Target,now=new Date()):Promise<Availability>{
 const s=t.agent?.agent_session??t.pane.agent_session??undefined
 if(!d.availability)return unknownAvailability(now)
 return d.availability.get(s,now).catch(()=>unknownAvailability(now)).then(a=>normalizeAvailability(a,now))
}
