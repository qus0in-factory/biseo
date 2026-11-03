import { mkdtemp, rm } from 'node:fs/promises'
import { createServer } from 'node:net'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const ACK = '{"id":"sub","result":{"type":"subscription_started"}}\n'

export async function startZeroShotSocket() {
  const dir = await mkdtemp(join(tmpdir(), 'biseo-zs-'))
  const sockPath = join(dir, 'h.sock')
  const server = createServer((s) => s.once('data', () => s.write(ACK)))
  await new Promise<void>((r) => server.listen(sockPath, r))
  const prev = process.env.HERDR_SOCKET_PATH
  process.env.HERDR_SOCKET_PATH = sockPath
  return async () => {
    if (prev === undefined) delete process.env.HERDR_SOCKET_PATH
    else process.env.HERDR_SOCKET_PATH = prev
    await new Promise<void>((r) => server.close(() => r()))
    await rm(dir, { recursive: true, force: true })
  }
}
