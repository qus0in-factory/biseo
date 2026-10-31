import type{UsageProvider}from'../domain/usage'
import r from'../resources.json'
export function UsagePanelHeader({provider}:{provider:UsageProvider}){
 const s=(r as Record<string,string>)[`usage_${provider.state}`]??provider.state
 return <div className="flex items-center justify-between gap-3">
  <span className="font-medium">{provider.provider}</span>
  <span className={provider.state==='limited'?'text-error':'text-muted-foreground'}>{s}</span>
 </div>
}
