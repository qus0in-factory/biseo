import{useState}from'react'
import{Button}from'../components/ui/button'
import{PasswordField}from'./PasswordField'
import{PinField}from'./PinField'
import{LoginModeTabs}from'./LoginModeTabs'
import r from'../resources.json'
type Props={busy:boolean;onLogin:(pw:string)=>void;onPinLogin?:(pin:string)=>void}
export function LoginForm({busy,onLogin,onPinLogin}:Props){
 const[pw,setPw]=useState('')
 const[pin,setPin]=useState('')
 const[pinMode,setPinMode]=useState(false)
 const usePin=pinMode&&!!onPinLogin
 return<form className="mx-auto flex w-full max-w-[360px] flex-col gap-3"
  onSubmit={e=>{e.preventDefault();usePin?onPinLogin?.(pin):onLogin(pw)}}>
  {onPinLogin&&<LoginModeTabs pinMode={usePin} onChange={setPinMode}/>}
  {usePin?<PinField value={pin} onChange={setPin} disabled={busy}/>:<PasswordField value={pw} onChange={setPw} disabled={busy}/>}
  <Button className="w-full" type="submit" disabled={busy}>{usePin?r.pinLogin:r.login}</Button>
 </form>
}
