import{agyModel}from'./pane-model-agy.js'
const SEP=' · ',TAIL=6,OPENCODE=/^[┃│|]?\s*build\b/i
const middle=(s:string)=>{
 const p=s.split(SEP)
 return p.length>=3?p[p.length-2].trim():null
}
export function modelDisplay(lines:string[],kind:string|null):string|null{
 const tail=lines.map(s=>s.trim()).filter(Boolean).slice(-TAIL)
 if(kind==='opencode'){
  for(let i=tail.length-1;i>=0;i--)
   if(OPENCODE.test(tail[i])&&tail[i].includes(SEP))return middle(tail[i])
  return null
 }
 if(kind==='agy'){
  const last=tail[tail.length-1]
  if(!last)return null
  const parts=last.split(SEP)
  if(parts.length<3)return null
  for(const part of parts){
   const model=agyModel(part)
   if(model)return model
  }
  return null
 }
 return null
}
