export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected'

export function connectionStatus(online: boolean, wasConnected: boolean): ConnectionStatus {
  if (online) return 'connected'
  return wasConnected ? 'disconnected' : 'connecting'
}
