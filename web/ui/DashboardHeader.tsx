import type { ReactNode } from 'react'
import type { ConnectionStatus } from '../domain/connectionStatus'
import { SessionActions } from './SessionActions'

export function DashboardHeader({ connection, actions, busy, onLogout }: { connection: ConnectionStatus; actions?: ReactNode; busy?: boolean; onLogout?: () => void }) {
  return <SessionActions connection={connection} actions={actions} busy={busy} onLogout={onLogout} />
}
