import{Button}from'../components/ui/button'
import{PasswordField}from'./PasswordField'
import{PinField}from'./PinField'
import{LoginModeLink}from'./LoginModeLink'
import{HiddenUsername}from'./HiddenUsername'
import{useLoginForm,type LoginFormProps}from'./useLoginForm'
import{LoginSkeleton}from'./LoginSkeleton'
import r from'../resources.json'
export function LoginForm({busy,onLogin,onPinLogin:pin,pinPreferred:pref}:LoginFormProps){
 const f=useLoginForm(onLogin,pin,pref)
 return f.waiting?<LoginSkeleton/>:(
  <form className="mx-auto flex w-full max-w-sm flex-col gap-3" onSubmit={f.submit}>
   <HiddenUsername/>
   {f.usePin?<PinField value={f.pin} onChange={f.setPin} disabled={busy}/>:<PasswordField value={f.pw} onChange={f.setPw} disabled={busy}/>}
   <Button className="w-full" type="submit" disabled={busy}>{r.login}</Button>
   {f.usePin&&<LoginModeLink toPin={false} onClick={()=>f.setPassword(true)}/>}
   {f.pinAvailable&&!f.usePin&&<LoginModeLink toPin onClick={()=>f.setPassword(false)}/>}
  </form>
 )
}
