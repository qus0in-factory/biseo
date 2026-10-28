import type { LoginDeps } from './login.js'

export const testPolicy = {
  issuer: 'iss',
  audiences: { 'user-session': 'a-user', service: 'a-svc' },
  ttlSeconds: { 'user-session': 60, service: 30 },
  clockToleranceSeconds: 0,
}

export const makeDeps = (
  ok: boolean,
  over: Partial<LoginDeps> = {},
): LoginDeps => ({
  verifier: { verify: async () => ok },
  signer: { sign: async (c) => `T:${c.aud}:${c.iss}:${c.sub}` },
  policy: testPolicy,
  storedVerifier: 'stored',
  subject: 'owner',
  now: () => new Date(0),
  ...over,
})
