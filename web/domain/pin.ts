export type PinStatus = {
  ip: string | null
  trusted: boolean
  available: boolean
  canManage: boolean
  pinConfigured: boolean
}

export function isPin(v: string): boolean {
  return /^\d{6}$/.test(v)
}
