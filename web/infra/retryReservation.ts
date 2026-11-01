import ky from 'ky'
import type { TimelineItem } from '../domain/timeline'
import { opts } from './apiOptions'
export const retryInput=(item:TimelineItem,paneId:string)=>({requestId:crypto.randomUUID(),workspaceId:item.workspaceId,paneId})
export function retryReservation(item:TimelineItem,paneId:string){
 return ky.post(`/api/turns/${encodeURIComponent(item.requestId)}/retry`,{
  ...opts,json:retryInput(item,paneId),
 }).json<TimelineItem>()
}
