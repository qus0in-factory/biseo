import r from '../resources.json'
const res = r as Record<string, string>

export function getPaneReason(d: string | null | undefined): string | null {
  return d ? `${res.reasonPrefix}${res[d] ?? d}` : null
}
