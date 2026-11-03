import app from '../index.js'
import{createTimelineTestEnv}from'./timeline-helpers.js'
const SQL=`INSERT INTO timeline_turns (request_id,workspace_id,owner_subject,pane_id,target_name,agent_kind,prompt_text,status,response_text,error_code,created_at,updated_at,completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`
export const makeEnv=async()=>{const{env,cookie}=await createTimelineTestEnv();return{env,cookie}}
export const add=async(env:any,id:string,pane:string,owner='owner',ws='w1T')=>{
 const now=new Date().toISOString()
 await env.BISEO_DB.prepare(SQL).bind(id,ws,owner,pane,'p',null,'hi','completed','done',null,now,now,now).run()
}
export const page=(env:any,cookie:string,q:string)=>
 app.fetch(new Request(`http://localhost/api/timeline/messages?workspaceId=w1T&${q}`,{headers:{Cookie:cookie}}),env)
export type PageBody={items:{requestId:string;seq:number}[];hasMore:boolean;nextBefore:number|null}
export const body=async(r:Response)=>await r.json() as PageBody
