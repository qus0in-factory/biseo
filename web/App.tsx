import{useAuth}from'./app/useAuth'
import{useHealth}from'./useHealth'
import{authApi}from'./infra/authApi'
import{healthApi}from'./infra/healthApi'
import{AppHeader}from'./ui/AppHeader'
import{AppContent}from'./ui/AppContent'
import{AppFooter}from'./ui/AppFooter'
import{AppFrame}from'./ui/AppFrame'
import{LoadingState}from'./ui/LoadingState'
import r from'./resources.json'
import'./index.css'
export default function App(){
 const a=useAuth(authApi)
 const h=useHealth(healthApi,a.authed,a.expire)
 if(!a.ready)return<AppFrame><AppHeader/><LoadingState rows={2}/></AppFrame>
 return<AppFrame>
  <AppHeader authed={a.authed} busy={a.busy} onLogout={a.logout} loading={h.loading} error={h.data?.error} onCheck={h.check}/>
  <AppContent {...a} {...h}/>
  {a.code&&<p role="alert" className="mx-auto w-full max-w-[360px] text-error">{r[a.code]}</p>}
  {a.authed&&<AppFooter/>}
 </AppFrame>
}
