import{readNew,waitChange}from'./transcript-io.js'
export async function readTranscript(path:string,offset:number,parse:(raw:string,prompt:string)=>string|null,prompt:string,ms:number){
 const end=Date.now()+ms
 for(;;){
  const text=parse(await readNew(path,offset),prompt)
  if(text)return text
  if(Date.now()>=end)return null
  await waitChange(path,end-Date.now())
 }
}
