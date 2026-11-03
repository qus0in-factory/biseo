import { interrupt } from './routes-interrupt-fixture.js'

export const enforcement = async (env: any, cookie: string) => {
  const c = { Cookie: cookie, Origin: 'http://localhost' }
  return {
    badOrigin: await interrupt(env, 'w1T:p1', 'esc', { ...c, Origin: 'https://evil.test' }),
    other: await interrupt(env, 'w2:p1', 'esc', c),
    badKey: await interrupt(env, 'w1T:p1', 'return!', c),
    noAuth: await interrupt(env, 'w1T:p1', 'esc', { Origin: 'http://localhost' }),
  }
}
