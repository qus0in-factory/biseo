import { useUiStore } from './uiStore'

export function useConnection() {
  const connection = useUiStore((s) => s.connection)
  const setOnline = useUiStore((s) => s.setOnline)
  return { online: connection === 'connected', connection, setOnline }
}
