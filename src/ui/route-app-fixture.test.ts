import { createApp } from './app.js'
import { makeDeps } from '../app/turn-fixture.test.js'

export const appOf = (d: ReturnType<typeof makeDeps>) =>
  createApp({
    ...d,
    verify: async (t) => {
      if (t !== 'x') throw new Error('no')
    },
    healthStatus: 'ok',
    timeoutMs: 1000,
    graceMs: 0,
  })
