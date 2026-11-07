// Release gate: prod bundle app version mark must match package.json (GET only).
import { readFile } from 'node:fs/promises'
import { hasVersionMark, makeGet } from './release-version-mark.mjs'

const load = async (p) => JSON.parse(await readFile(new URL(p, import.meta.url), 'utf8'))
const { version } = await load('../package.json')
const { url, timeoutMs, versionMarkPrefix } = await load('../config/release-verify.json')
const get = makeGet(url, timeoutMs)

try {
  const html = await get('/')
  const assets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+\.js)"/g)].map((m) => m[1])
  if (!assets.length) throw new Error('no script bundle found in /')
  for (const a of assets) {
    if (hasVersionMark(await get(a), versionMarkPrefix, version)) {
      console.log(`release-verify: ${url} bundle ${version} == package.json`)
      process.exit(0)
    }
  }
  console.error(`release-verify: ${url} lacks mark ${version}; run pnpm deploy`)
} catch (e) {
  console.error(`release-verify: ${e.message}`)
}
process.exit(1)
