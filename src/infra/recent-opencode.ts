import{recentOpencodeRows}from'./recent-opencode-rows.js'
import{parseTurn}from'./opencode-parse.js'
export function recentOpencode(id:string){
 if(!/^ses_[A-Za-z0-9]+$/.test(id))return null
  const rows=recentOpencodeRows(id)
  if(!rows)return null
  let last=rows.length-1
  while(last>=0&&rows[last].type!=='user')last--
  if(last<0)return null
  const prompt=JSON.parse(rows[last].data).text
  if(typeof prompt!=='string')return null
  const result=parseTurn(rows.slice(last),prompt)
  return result.text?{promptText:prompt,responseText:result.text}:null
}
