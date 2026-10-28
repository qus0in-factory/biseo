export type AuthCode = 'needPassword' | 'authFailed' | 'unknown' | null
export type Health = { status?: string; error?: string }

export class ApiError extends Error {
  constructor(public readonly code: Exclude<AuthCode, null>) {
    super(code)
  }
}

export interface AuthPort {
  login(pw: string): Promise<void>
  logout(): Promise<void>
  session(): Promise<void>
}

export interface HealthPort {
  getHealth(): Promise<Health>
}

export function canSubmit(pw: string): boolean {
  return pw.length > 0
}

export function loginCode(status?: number): Exclude<AuthCode, null> {
  if (status === 401) return 'authFailed'
  return 'unknown'
}

export function toAuthCode(e: unknown): Exclude<AuthCode, null> {
  return e instanceof ApiError ? e.code : 'unknown'
}
