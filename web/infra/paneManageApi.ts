import ky from'./sessionHttp'
import{opts}from'./apiOptions'
import { apiErrorCode } from './paneApiError'
import { PaneCloseError } from '../domain/paneCloseError'
export const paneManageApi={
 openPane:async(input:{templateId?:string;name?:string})=>{
  const r=await ky.post('/api/panes',{...opts,json:input}).json<{paneId:string}>()
  return{paneId:r.paneId}
 },
 closePane:async(paneId:string)=>{
  try{await ky.delete(`/api/panes/${encodeURIComponent(paneId)}`,opts)}
  catch(error){throw new PaneCloseError(apiErrorCode(error))}
 },
 renamePane:async(paneId:string,name:string)=>{
  await ky.post(`/api/panes/${encodeURIComponent(paneId)}/rename`,{...opts,json:{name}})
 },
}
