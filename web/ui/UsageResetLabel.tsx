import { useContext } from 'react'
import { UsageModalDisplay } from './UsageModalDisplay'
import { usageRelativeTime } from './usageRelativeTime'
import { formatZonedShort } from '../domain/formatZoned'
import r from '../resources.json'

export function UsageResetLabel({ at }: { at: string | null }) {
  const modal = useContext(UsageModalDisplay)
  if (!at) return r.usageNoReset
  return modal ? usageRelativeTime(at) ?? r.usageNoReset : formatZonedShort(at, 'Asia/Seoul')
}
