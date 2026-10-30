type L=Record<string,string>
const tail=(i:string)=>i.slice(i.lastIndexOf(':')+1)
const canon=(p:string,i:string)=>{
const s=tail(i)
if(p==='claude')return s==='five_hour'?'primary':s.startsWith('seven_day')?'secondary':s
if(p==='agy')return s==='5h'||s.endsWith('-5h')?'primary':s==='weekly'||s.endsWith('-weekly')?'secondary':s
return i}
export const usageMetricName=(p:string,i:string,f:string,l:L)=>l[`usageWindow_${p}_${i}`]??l[`usageWindow_${p}_${canon(p,i)}`]??f
