import type { ReactNode } from 'react'
import { useUsagePace } from '../app/useUsagePace'
import { UsagePaceDisplay } from './UsagePaceDisplay'

export function UsagePaceProvider({ children }: { children: ReactNode }) {
  const { settings, toggle } = useUsagePace()
  return <UsagePaceDisplay value={{ settings, toggle }}>{children}</UsagePaceDisplay>
}
