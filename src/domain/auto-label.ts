export type AliasRule={provider?:string;model:string;alias:string}
export type Obs={modelId:string;provider:string}
export function pickAlias(rules:AliasRule[],m?:Obs){
 if(!m)return null
 const r=rules.find(r=>(!r.provider||r.provider===m.provider)&&m.modelId.includes(r.model))
 return r?.alias??null
}
export function uniqueLabel(alias:string,taken:Set<string>){
 let n=1,l=alias
 while(taken.has(l))l=alias+ ++n
 return l
}
