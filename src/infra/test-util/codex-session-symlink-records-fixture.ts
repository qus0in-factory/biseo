import{writeFile}from'node:fs/promises'
import{join}from'node:path'
import{rec,key}from'./codex-session-record-fixture.js'
export async function writeSymlinkRecords(base:string){
 const dir=join(base,'state','codex'),root=join(base,'sessions'),link=join(root,'link.jsonl'),dot=join(root,'..rollout.jsonl')
 await writeFile(join(dir,key('w:p1')+'.json'),rec('s1',link))
 await writeFile(join(dir,key('w:p2')+'.json'),rec('s2',dot))
 await writeFile(join(dir,key('w:p3')+'.json'),rec('s3','/etc/passwd'))
 await writeFile(join(dir,key('w:p4')+'.json'),'{bad')
 await writeFile(join(dir,key('w:p5')+'.json'),JSON.stringify({session_id:'s5',transcript_path:dot}))
}
