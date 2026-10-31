import { Button } from '../components/ui/button'
import { PasswordField } from './PasswordField'
import { PinField } from './PinField'
import { LoginModeTabs } from './LoginModeTabs'
import { HiddenUsername } from './HiddenUsername'
import { useLoginForm, type LoginFormProps } from './useLoginForm'
import r from '../resources.json'

export function LoginForm({ busy, onLogin, onPinLogin }: LoginFormProps) {
  const f = useLoginForm(onLogin, onPinLogin)
  return (
    <form className="mx-auto flex w-full max-w-[360px] flex-col gap-3" onSubmit={f.submit}>
      <HiddenUsername />
      {onPinLogin && <LoginModeTabs pinMode={f.usePin} onChange={f.setMode} />}
      {f.usePin ? (
        <PinField value={f.pin} onChange={f.setPin} disabled={busy} />
      ) : (
        <PasswordField value={f.pw} onChange={f.setPw} disabled={busy} />
      )}
      <Button className="w-full" type="submit" disabled={busy}>
        {f.usePin ? r.pinLogin : r.login}
      </Button>
    </form>
  )
}
