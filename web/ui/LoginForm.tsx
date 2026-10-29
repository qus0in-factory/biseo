import { useState } from 'react'
import { Button } from '../components/ui/button'
import { PasswordField } from './PasswordField'
import r from '../resources.json'
type Props = { busy: boolean; onLogin: (pw: string) => void }
export function LoginForm({ busy, onLogin }: Props) {
  const [pw, setPw] = useState('')
  return (
    <form
      className="mx-auto flex w-full max-w-[360px] flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        onLogin(pw)
      }}
    >
      <PasswordField value={pw} onChange={setPw} disabled={busy} />
      <Button className="w-full" type="submit" disabled={busy}>
        {r.login}
      </Button>
    </form>
  )
}
