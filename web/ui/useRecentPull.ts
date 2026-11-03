import{useMutation}from'@tanstack/react-query'
import{pullRecent}from'../infra/recentApi'
export type RecentPull=ReturnType<typeof useRecentPull>
export function useRecentPull(pane:string,onImported?:()=>void){
 return useMutation({
  mutationKey:['recent',pane],
  mutationFn:()=>pullRecent(pane),
  onSuccess:result=>{if(result.state==='imported')onImported?.()},
 })
}
