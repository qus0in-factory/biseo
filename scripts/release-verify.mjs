// Release gate: prod bundle version mark == package.json. Needs dist/server.
import { readFile } from 'node:fs/promises'
import { bundleHasMark, makeGet } from './release-version-mark.mjs'
const verify = await import('../dist/server/src/infra/release-verify-url.js')

const at = (p) => new URL(p, import.meta.url)
const load = async (p) => JSON.parse(await readFile(at(p), 'utf8'))
const { version } = await load('../package.json')
const { url: fileUrl, timeoutMs, versionMarkPrefix } = await load('../config/release-verify.json')
const url = await verify.loadVerifyUrl(fileUrl, at('../wrangler.jsonc'))
if (!url) { console.error(verify.missingUrlHint); process.exit(1) }

try {
  if (await bundleHasMark(makeGet(url, timeoutMs), versionMarkPrefix, version)) {
    console.log(`release-verify: ${url} bundle ${version} == package.json`)
    process.exit(0)
  }
  console.error(`release-verify: ${url} lacks mark ${version}; run pnpm deploy`)
} catch (e) {
  console.error(`release-verify: ${e.message}`)
}
process.exit(1)
