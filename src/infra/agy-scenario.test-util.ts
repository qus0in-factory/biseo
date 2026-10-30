import { rmSync } from 'node:fs'
import { fetchAgyUsage } from './agy-usage-fetch.js'
import { clearAgyTokenCache } from './agy-token.js'
import { putAgyTokenFile, agyTestEnv } from './agy-test-support.test-util.js'
import type { ProviderUsage } from '../domain/usage-types.js'

export async function checkAgyScenario(name: string, exp: string, at: string, route: (u: string, init: RequestInit | undefined, grants: string[]) => unknown, check: (res: ProviderUsage, grants: string[]) => unknown) {
  const p = putAgyTokenFile(name, exp)
  agyTestEnv(p)
  clearAgyTokenCache()
  const orig = globalThis.fetch
  const grants: string[] = []
  const tokenUrl = process.env.BISEO_AGY_TOKEN_URL as string
  globalThis.fetch = (async (u: string, init?: RequestInit) => {
    if (u.includes(tokenUrl)) grants.push(String(init?.body))
    return route(u, init, grants)
  }) as typeof fetch
  try {
    await check(await fetchAgyUsage(new Date(at)), grants)
  } finally {
    globalThis.fetch = orig
    rmSync(p)
  }
}
