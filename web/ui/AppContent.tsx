import type { ReactNode } from 'react'
import { useOutlet } from 'react-router'
import { LoginForm } from './LoginForm'
import { HealthView } from './HealthView'
import { WorkspaceSection } from './WorkspaceSection'

export interface AppOutletContext {
  headerActions?: ReactNode
  authed?: boolean
}

export function AppContent({
  authed,
  busy,
  login,
  loginPin,
  loading,
  data,
  check,
}: {
  authed: boolean
  busy: boolean
  login: (pw: string) => void
  loginPin: (pin: string) => void
  loading: boolean
  data?: { status?: string; error?: string } | null
  check: () => void
}): ReactNode {
  const actions = <HealthView loading={loading} error={data?.error} onCheck={check} />
  const outlet = useOutlet({ headerActions: actions, authed })
  if (!authed) return <div className="flex flex-1 items-center justify-center overflow-auto py-4"><LoginForm busy={busy} onLogin={login} onPinLogin={loginPin} /></div>
  if (outlet) return outlet
  return <WorkspaceSection on={authed} headerActions={actions} />
}
