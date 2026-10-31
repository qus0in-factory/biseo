import type{D1Database}from'@cloudflare/workers-types'
import type{UpstreamEnv}from'./infra/herdr-upstream-config.js'
import{queueUpstream}from'./infra/queue-upstream.js'
import{createHerdrUpstream}from'./infra/herdr-upstream.js'
import{runD1Queue}from'./app/run-d1-queue.js'
export function queueTick(db:D1Database,env:UpstreamEnv){
 return runD1Queue(db,queueUpstream(env),createHerdrUpstream(env))
}
