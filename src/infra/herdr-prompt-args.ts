export function promptArgs(id:string,text:string,acceptanceMs?:number){
 const a=['agent','prompt',id,text]
 if(acceptanceMs&&acceptanceMs>0)a.push('--wait','--until','working','--until','blocked','--timeout',String(acceptanceMs))
 return a
}
