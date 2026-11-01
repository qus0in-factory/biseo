export type LoginMode = 'password' | 'pin'

export function parseLoginMode(raw: unknown): LoginMode {
  return raw === 'pin' ? 'pin' : 'password'
}

export function restoreLoginMode(
  storage: { getItem(k: string): string | null } | null | undefined,
  key: string
): LoginMode {
  try {
    return parseLoginMode(storage?.getItem(key))
  } catch {
    return 'password'
  }
}

export function saveLoginMode(
  storage: { setItem(k: string, v: string): void } | null | undefined,
  key: string,
  mode: LoginMode
): void {
  try {
    storage?.setItem(key, mode)
  } catch {}
}
