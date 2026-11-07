import { setLastGrokSnapshot } from '../grok-snapshot-store.js'
import http from 'node:http'

export { staleGrokUsage } from './grok-stale-fixture.test-util.js'

function initGrokMock(p: number) {
  setLastGrokSnapshot(null)
  process.env.BISEO_GROK_BILLING_URL = `http://127.0.0.1:${p}/billing`
}

function cleanGrokEnv() {
  delete process.env.BISEO_GROK_BILLING_URL
}

export async function withGrokMock(handler: http.RequestListener, run: () => Promise<void>) {
  const server = http.createServer(handler)
  await new Promise<void>(done => server.listen(0, '127.0.0.1', done))
  initGrokMock((server.address() as { port: number }).port)
  try { await run() } finally {
    server.closeAllConnections()
    await new Promise<void>(done => server.close(() => done()))
    cleanGrokEnv()
    setLastGrokSnapshot(null)
  }
}
