import { useState } from 'react'
import r from '../resources.json'
type Props = { busy: boolean; onLogin: (pw: string) => void }
export function LoginForm({ busy, onLogin }: Props) {
  const [pw, setPw] = useState('')
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        onLogin(pw)
      }}
    >
      <label>
        {r.passwordLabel}
        <input
          type="password"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          disabled={busy}
        />
      </label>
      <button className="btn" type="submit" disabled={busy}>
        {r.login}
      </button>
    </form>
  )
}
