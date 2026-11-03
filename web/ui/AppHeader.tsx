import type{ReactNode}from'react'
import type{ConnectionStatus}from'../domain/connectionStatus'
import{useUiStore}from'../app/uiStore'
import{HeaderBrand}from'./HeaderBrand'
import{HeaderMenuButton}from'./HeaderMenuButton'
import{HealthView}from'./HealthView'
import{SessionActions}from'./SessionActions'
export interface AppHeaderProps{
 authed?:boolean;busy?:boolean;onLogout?:()=>void
 connection?:ConnectionStatus;actions?:ReactNode
 loading?:boolean;error?:string;onCheck?:()=>void
}
export function AppHeader(p:AppHeaderProps){
 const c=useUiStore(s=>s.connection)
 const a=p.actions??(p.onCheck?<HealthView loading={!!p.loading} error={p.error} onCheck={p.onCheck}/>:null)
 return<header className="flex min-w-0 flex-wrap items-center justify-between gap-x-3 gap-y-1 border-b border-border pb-2">
  <div className="flex min-w-0 items-center gap-2">{p.authed&&<HeaderMenuButton/>}<HeaderBrand/></div>
  {p.authed&&<SessionActions {...p} connection={p.connection??c} actions={a}/>}
 </header>
}
