import type{ReactNode}from'react'
import{LogOut}from'lucide-react'
import type{ConnectionStatus}from'../domain/connectionStatus'
import{Button}from'../components/ui/button'
import{ConnectionStatusBadge}from'./ConnectionStatusBadge'
import{SettingsButton}from'./SettingsButton'
import{UsageButton}from'./UsageButton'
import r from'../resources.json'

export interface SessionActionsProps{
 connection?:ConnectionStatus
 actions?:ReactNode
 busy?:boolean
 onLogout?:()=>void
}

export function SessionActions({connection='connecting',actions,busy,onLogout}:SessionActionsProps){
 return(
  <div className="ml-auto flex shrink-0 flex-wrap items-center justify-end gap-1">
   <ConnectionStatusBadge status={connection}/>
   <UsageButton enabled={connection==='connected'}/>
   {actions}
   <SettingsButton/>
   {onLogout&&<Button type="button" variant="ghost" size="icon" className="hover:bg-muted"
    onClick={onLogout} disabled={busy} aria-label={r.logout} title={r.logout}>
    <LogOut size={16} aria-hidden="true"/>
   </Button>}
  </div>
 )
}
