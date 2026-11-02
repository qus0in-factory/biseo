import sessionHttp from'./sessionHttp'
import{opts}from'./apiOptions'
export function pullRecent(pane:string){
 return sessionHttp.post(`/api/panes/${encodeURIComponent(pane)}/recent`,opts)
 .json<{state:'imported'|'duplicate'|'empty'}>()
}
