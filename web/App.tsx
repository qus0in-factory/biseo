import{useAuth}from'./app/useAuth'
import{useHealth}from'./useHealth'
import{authApi}from'./infra/authApi'
import{healthApi}from'./infra/healthApi'
import{AppHeader}from'./ui/AppHeader'
import{AppContent}from'./ui/AppContent'
import{AppFooter}from'./ui/AppFooter'
import{AppFrame}from'./ui/AppFrame'
import r from'./resources.json'
import'./index.css'
export default function App(){
 const{authed,busy,ready,code,login,loginPin,logout,expire}=useAuth(authApi)
 const{data,loading,check}=useHealth(healthApi,authed,expire)
 if(!ready)return<AppFrame><AppHeader/><p>{r.loading}</p></AppFrame>
 return<AppFrame>
  <AppHeader authed={authed} busy={busy} onLogout={logout}/>
  <AppContent authed={authed} busy={busy} login={login} loginPin={loginPin} loading={loading} data={data} check={check}/>
  {code&&<p role="alert" className="mx-auto w-full max-w-[360px] text-error">{r[code]}</p>}
  {authed&&<AppFooter/>}
 </AppFrame>
}
