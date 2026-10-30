import test from 'node:test'
import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'
import { fetchOllamaUsage } from './ollama-usage-fetch.js'

test('fetchOllamaUsage returns available with mocked endpoints', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'ollama-key-'))
  const keyPath = join(dir, 'id_ed25519')
  execFileSync('ssh-keygen', ['-t', 'ed25519', '-N', '', '-f', keyPath, '-C', 'test'], { stdio: 'ignore' })
  process.env.BISEO_OLLAMA_KEY_PATH = keyPath
  const origFetch = globalThis.fetch
  globalThis.fetch = (async (url: any) => {
    const u = String(url)
    if (u.includes('/api/usage')) return Response.json({ totals: { request_count: 5 } })
    return new Response('', { status: 404 })
  }) as typeof fetch
  try {
    const res = await fetchOllamaUsage()
    assert.equal(res.provider, 'ollama')
    assert.equal(res.state, 'available')
    assert.equal(res.windows.length, 1)
    assert.equal(res.windows[0].window, 'primary')
  } finally {
    globalThis.fetch = origFetch
    delete process.env.BISEO_OLLAMA_KEY_PATH
  }
})
