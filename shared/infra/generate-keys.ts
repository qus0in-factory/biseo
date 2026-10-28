import { writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { generateExtractableKeys } from './keys.js'
import { exportKeys } from './paserk.js'

const [secretPath, publicPath, ...rest] = process.argv.slice(2)
if (!secretPath || !publicPath || rest.length) {
  console.error('usage: generate-keys.ts <secret-path> <public-path>')
  process.exit(1)
}

try {
  const paserk = await exportKeys(await generateExtractableKeys())
  const write = (path: string, value: string) =>
    writeFile(resolve(path), `${value}\n`, { flag: 'wx', mode: 0o600 })
  await write(publicPath, paserk.publicKey)
  await write(secretPath, paserk.secretKey)
} catch {
  console.error('key generation failed')
  process.exit(1)
}
