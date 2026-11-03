import { useContext } from 'react'
import { UsageModalDisplay } from './UsageModalDisplay'
import { usageRelativeTime } from './usageRelativeTime'
import { formatZonedShort } from '../domain/formatZoned'
import { isResetPassed } from '../domain/usage-auth-state'
import r from '../resources.json'

export function UsageResetLabel({ at, expected = false }: { at: string | null; expected?: boolean }) {
  const modal = useContext(UsageModalDisplay)
  if (!at) return r.usageNoReset
  if (!modal) return formatZonedShort(at, 'Asia/Seoul')
  const rel = usageRelativeTime(at)
  if (!rel) return r.usageNoReset
  if (!expected) return rel
  return isResetPassed(at) ? `${r.usageResetPassed} · ${rel}` : `${r.usageResetExpected} · ${rel}`
}
