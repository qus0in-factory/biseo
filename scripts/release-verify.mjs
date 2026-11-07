// Release gate: production bundle version must equal package.json (read-only GETs).
import { readFile } from 'node:fs/promises'

const load = async (p) => JSON.parse(await readFile(new URL(p, import.meta.url), 'utf8'))
const { version } = await load('../package.json')
const { url, timeoutMs } = await load('../config/release-verify.json')
const get = async (path) => {
  const res = await fetch(new URL(path, url), { signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new Error(`${path} -> ${res.status}`)
  return res.text()
}

try {
  const html = await get('/')
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
  if (!assets.length) throw new Error('no script bundle found in /')
  for (const a of assets) {
    if (new RegExp(`["'\`]${version.replaceAll('.', '\\.')}["'\`]`).test(await get(a))) {
      console.log(`release-verify: ${url} bundle ${version} == package.json`)
      process.exit(0)
    }
  }
  console.error(`release-verify: ${url} bundle lacks ${version}; run pnpm deploy`)
} catch (e) {
  console.error(`release-verify: ${e.message}`)
}
process.exit(1)
