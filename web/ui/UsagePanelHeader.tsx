import { AlertTriangle, CircleCheck, HelpCircle } from 'lucide-react'
import type{UsageProvider}from'../domain/usage'
import r from'../resources.json'
import { UsageHistoryButton } from './UsageHistoryButton'
const states={
 available:{Icon:CircleCheck,className:'text-success'},
 limited:{Icon:AlertTriangle,className:'text-error'},
 unknown:{Icon:HelpCircle,className:'text-muted-foreground'},
}
export function UsagePanelHeader({provider}:{provider:UsageProvider}){
 const s=(r as Record<string,string>)[`usage_${provider.state}`]??provider.state
 const {Icon,className}=states[provider.state]
 return <div className="flex items-center justify-between gap-3">
  <span className="font-medium">{provider.provider}</span>
  <div className="flex items-center"><span className={`inline-flex shrink-0 items-center ${className}`} title={s} aria-label={s} role="img">
   <Icon size={14} aria-hidden="true"/>
  </span><UsageHistoryButton provider={provider.provider}/></div>
 </div>
}
