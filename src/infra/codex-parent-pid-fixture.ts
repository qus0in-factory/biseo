import { spawnSync } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

export const script = fileURLToPath(new URL('../../scripts/codex-parent-pid.sh', import.meta.url))

export function fakePs(base: string, lines: string) {
 const dir = join(base, 'bin')
 mkdirSync(dir, { recursive: true })
 writeFileSync(join(dir, 'ps'), `#!/bin/sh\ncase "$2:$4" in\n${lines}\nesac\n`, { mode: 0o755 })
 return dir
}

export function run(base: string, ps: string, pid: string) {
 return spawnSync('sh', [script, pid], { encoding: 'utf8', env: { ...process.env, PATH: fakePs(base, ps) + ':' + process.env.PATH } })
}