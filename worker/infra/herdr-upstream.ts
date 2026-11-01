import type{HerdrUpstreamPort as P}from'../app/timeline-ports.js'
import{workspacesUpstream}from'./workspaces-upstream.js'
import type{TimelineItem as T}from'../domain/timeline-types.js'
import type{UpstreamEnv as E}from'./herdr-upstream-config.js'
import{callUpstreamJson as j}from'./herdr-upstream-http.js'
import{openUpstreamEvents as s}from'./herdr-upstream-stream.js'
import{resolveRequestId as r}from'./upstream-log.js'
export function createHerdrUpstream(e:E,src?:Parameters<typeof r>[0]):P{
 const id=r(src)
 return{
  ...workspacesUpstream(e,id),
  submitTurn:i=>j(e,'/herdr/turns','POST',i,id),
  getTurn:t=>j<T>(e,`/herdr/turns/${encodeURIComponent(t)}`,'GET',undefined,id),
  cancelTurn:t=>j(e,`/herdr/turns/${encodeURIComponent(t)}`,'DELETE',undefined,id),
  interruptPane:(p,k)=>j(e,`/herdr/panes/${encodeURIComponent(p)}/interrupt`,'POST',{key:k},id),
  openEventStream:(w,l,g)=>s(e,w,l,g,id),
 }
}
