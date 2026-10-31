import ky from'ky'
import{opts}from'./apiOptions'
export const paneManageApi={
 openPane:async(input:{templateId?:string;name?:string})=>{
  const r=await ky.post('/api/panes',{...opts,json:input}).json<{paneId:string}>()
  return{paneId:r.paneId}
 },
 closePane:async(paneId:string)=>{await ky.delete(`/api/panes/${encodeURIComponent(paneId)}`,opts)},
 renamePane:async(paneId:string,name:string)=>{
  await ky.post(`/api/panes/${encodeURIComponent(paneId)}/rename`,{...opts,json:{name}})
 },
}
