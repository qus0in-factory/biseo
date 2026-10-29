import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

export const scriptRead = '#!/bin/sh\nprintf \'%s\\n\' "$@" > "$ARGS_FILE"\nif [ "$1 $2" = "pane read" ]; then printf \'one\\ntwo\\n\'; else echo \'{}\'; fi\n'
export const scriptEcho = '#!/bin/sh\nprintf \'%s\\n\' "$@" > "$ARGS_FILE"\necho \'{}\'\n'
export const mkBin = (script: string) => {
  const dir = mkdtempSync(join(tmpdir(), 'b-'))
  const bin = join(dir, 'h')
  const args = join(dir, 'a')
  writeFileSync(bin, script, { mode: 0o755 })
  return { dir, bin, args }
}
export const readArgs = (args: string) => readFileSync(args, 'utf8').trim().split('\n')
export const rmBin = (dir: string) => rmSync(dir, { recursive: true, force: true })
export const expectedSendKeys = ['pane', 'send-keys', 'w:p1', 'esc']
export const expectedRead = ['pane', 'read', 'w:p1', '--source', 'recent', '--lines', '8', '--format', 'text']
