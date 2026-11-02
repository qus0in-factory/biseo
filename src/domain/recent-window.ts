import{parseLines}from'./transcript.js'
import{recentPrompt}from'./recent-prompt.js'
export function recentWindow(raw:string,source:string){
 const entries=parseLines(raw)
 for(let index=entries.length-1;index>=0;index--){
  const prompt=recentPrompt(JSON.stringify(entries[index]),source)
  if(prompt)return{prompt,raw:entries.slice(index).map(entry=>JSON.stringify(entry)).join('\n')}
 }
 return null
}
