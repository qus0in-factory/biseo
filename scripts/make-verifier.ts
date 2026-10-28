import { writeFileSync } from 'node:fs'
import { hashPassword } from '../worker/infra/password.js'

const MIN_LENGTH = Number(process.env.PASSWORD_MIN_LENGTH ?? 12)
const out = process.argv[2]
if (!out) throw new Error('usage: make-verifier.ts <output-path>')
const chunks: Buffer[] = []
for await (const c of process.stdin) chunks.push(c as Buffer)
const pass = Buffer.concat(chunks).toString('utf8').replace(/\r?\n$/, '')
if (pass.length < MIN_LENGTH) {
  console.error(`password too short (min ${MIN_LENGTH})`)
  process.exit(1)
}
writeFileSync(out, await hashPassword(pass), { mode: 0o600, flag: 'wx' })
