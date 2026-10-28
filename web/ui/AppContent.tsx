import type { ReactNode } from 'react'
import { LoginForm } from './LoginForm'
import { HealthView } from './HealthView'
import { WorkspaceSection } from './WorkspaceSection'

export function AppContent({
  authed,
  busy,
  login,
  loading,
  data,
  check,
}: {
  authed: boolean
  busy: boolean
  login: (pw: string) => void
  loading: boolean
  data?: { status?: string; error?: string } | null
  check: () => void
}): ReactNode {
  if (!authed) return <LoginForm busy={busy} onLogin={login} />
  return (
    <>
      <HealthView
        loading={loading}
        status={data?.status}
        error={data?.error}
        onCheck={check}
      />
      <WorkspaceSection on={authed} />
    </>
  )
}
