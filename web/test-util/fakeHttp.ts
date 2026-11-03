import type { TestContext } from 'node:test'
import { stubGlobal } from './stubGlobal'

export function fakeHttp(t: TestContext, respond: (req: Request) => Response | Promise<Response>) {
  const Native = globalThis.Request
  class BrowserRequest extends Native {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      super(typeof input === 'string' ? new URL(input, 'https://biseo.test') : input, init)
    }
  }
  stubGlobal(t, 'Request', BrowserRequest)
  const requests: Request[] = []
  t.mock.method(globalThis, 'fetch', async (input: Request) => {
    requests.push(input.clone() as Request)
    return respond(input)
  })
  return requests
}
