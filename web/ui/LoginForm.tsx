import{Button}from'../components/ui/button'
import{PasswordField}from'./PasswordField'
import{PinField}from'./PinField'
import{LoginModeLink}from'./LoginModeLink'
import{HiddenUsername}from'./HiddenUsername'
import{useLoginForm,type LoginFormProps}from'./useLoginForm'
import r from'../resources.json'

export function LoginForm({busy,onLogin,onPinLogin,pinPreferred}:LoginFormProps){
 const f=useLoginForm(onLogin,onPinLogin,pinPreferred)
 const back=f.pinAvailable&&!f.usePin
 return(
  <form className="mx-auto flex w-full max-w-[360px] flex-col gap-3" onSubmit={f.submit}>
   <HiddenUsername/>
   {f.usePin?<PinField value={f.pin} onChange={f.setPin} disabled={busy}/>:<PasswordField value={f.pw} onChange={f.setPw} disabled={busy}/>}
   <Button className="w-full" type="submit" disabled={busy}>{r.login}</Button>
   {f.usePin&&<LoginModeLink toPin={false} onClick={()=>f.setPassword(true)}/>}
   {back&&<LoginModeLink toPin onClick={()=>f.setPassword(false)}/>}
  </form>
 )
}
