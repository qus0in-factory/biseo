import r from '../resources.json'
const res = r as Record<string, string>

export function getPaneReason(d: string | null | undefined): string | null {
  if (!d || d === 'agent_busy') return null
  return `${res.reasonPrefix}${res[d] ?? d}`
}
