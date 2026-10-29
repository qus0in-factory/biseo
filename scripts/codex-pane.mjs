import{execFileSync}from'node:child_process'
function call(args){
 try{return{ok:true,v:JSON.parse(execFileSync(process.env.HERDR_BIN_PATH||'herdr',args,{encoding:'utf8',timeout:1500}))}}catch{return{ok:false}}
}
export function resolvePane(id){
 const env=process.env.HERDR_PANE_ID
 const a=call(['agent','list'])
 const hits=a.ok?(a.v?.result?.agents??[]).filter(x=>x.agent_session?.value===id&&x.pane_id):[]
 if(hits.length===1)return hits[0].pane_id
 const ws=process.env.HERDR_WORKSPACE_ID
 if(!ws)return env
 const p=call(['pane','list','--workspace',ws])
 if(!p.ok)return env
 return(p.v?.result?.panes??[]).some(x=>x.pane_id===env)?env:null
}
