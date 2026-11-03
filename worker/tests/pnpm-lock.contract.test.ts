import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const lock = readFileSync(new URL('../../pnpm-lock.yaml', import.meta.url).pathname).toString('utf8')
const version = (name: string) =>
  lock.match(new RegExp(`^  ${name}@(\\d+\\.\\d+\\.\\d+):`, 'm'))?.[1]

const atLeast = (v: string | undefined, min: number[]) => {
  const p = (v ?? '0').split('.').map(Number)
  for (let i = 0; i < min.length; i++) if (p[i] !== min[i]) return p[i] > min[i]
  return true
}

test('the lockfile keeps the patched js-yaml and basic-ftp releases', () => {
  assert.ok(atLeast(version('js-yaml'), [4, 3, 2]), version('js-yaml') ?? 'missing')
  const ftp = version('basic-ftp')
  assert.ok(ftp === undefined || atLeast(ftp, [6, 2, 1]), ftp ?? 'missing')
})
