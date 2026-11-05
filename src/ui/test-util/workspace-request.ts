import {auth}from'./app-data-fixture.js'
import type {Hono}from'hono'
export function workspaceRequest(app:Hono){
 return(id:string,authenticated=true)=>app.request('/herdr/workspaces/select',{
  method:'POST',headers:{...(authenticated?auth:{}),'content-type':'application/json'},
  body:JSON.stringify({workspaceId:id}),
 })
}
