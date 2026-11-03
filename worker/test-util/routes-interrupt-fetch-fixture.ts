import { limitBody } from './routes-interrupt-fixture.js'

export const relayPath = '/herdr/panes/w1T%3Ap1/interrupt'
export const relay = async (run: (seen: { req: Request | null }) => Promise<void>) => {
  const seen = { req: null as Request | null }
  const stub = (async (input: any, init: any) => {
    seen.req = new Request(input, init)
    return Response.json({ paneId: 'w1T:p1', key: 'esc', status: 'sent' })
  }) as any
  await withFetch(stub, async () => { await run(seen) })
}
export const withLimit = async (run: () => Promise<void>) => {
  await withFetch((async () => Response.json(limitBody, { status: 409 })) as any, run)
}
export const withFetch = async (stub: any, run: () => Promise<void>) => {
  const orig = globalThis.fetch
  globalThis.fetch = stub
  try {
    await run()
  } finally {
    globalThis.fetch = orig
  }
}
