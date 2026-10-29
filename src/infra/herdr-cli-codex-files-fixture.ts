import{writeFile}from'node:fs/promises'
import{join}from'node:path'
import{body}from'./herdr-cli-codex-body-fixture.js'
export async function writeHerdrCliFiles(ctx:any){
 const{state,root,bin,psdir}=ctx
 await writeFile(join(root,'rollout.jsonl'),'{}')
 const rec=(id:string)=>JSON.stringify({session_id:id,transcript_path:join(root,'rollout.jsonl'),pid:process.pid,created_at:Date.now()})
 await writeFile(join(psdir,'ps'),'#!/bin/sh\necho codex\n',{mode:0o755})
 await writeFile(join(state,'codex',Buffer.from('w:p1').toString('hex')+'.json'),rec('s1'))
 await writeFile(join(state,'codex',Buffer.from('w:p3').toString('hex')+'.json'),rec('s3'))
 await writeFile(bin,`#!/bin/sh\ncase "$1 $2" in\n${body}\n  *) echo '{}';;\nesac\n`,{mode:0o755})
}
