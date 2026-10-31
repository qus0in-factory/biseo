export type Purpose = 'user-session' | 'service'

export type Claims = {
  iss: string
  aud: string
  sub: string
  purpose: Purpose
  iat: string
  exp: string
  auth?: 'pin'
}

export type ClaimPolicy = {
  issuer: string
  audiences: Record<Purpose, string>
  ttlSeconds: Record<Purpose, number>
  clockToleranceSeconds: number
}
