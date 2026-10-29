import{codexAvailability}from'../domain/codex-availability.js'
import{unknownAvailability}from'../domain/availability.js'
import{demoteStale}from'../domain/availability-stale.js'
import type{Availability}from'../domain/timeline.js'
import type{AgentSession}from'../domain/herdr.js'
import{codexPath}from'./codex-find.js'
import{readRateLimits}from'./codex-rate-limit-read.js'
export function createAvailability(ttlMs=0){
 return{ttlMs,get:async(s:AgentSession|undefined,now=new Date()):Promise<Availability>=>{
  if(!s?.source.endsWith(':codex'))return unknownAvailability(now)
  const p=await codexPath(s).catch(()=>null)
  if(!p)return unknownAvailability(now)
  return demoteStale(codexAvailability(await readRateLimits(p),now,ttlMs),now,ttlMs)
 }}
}
