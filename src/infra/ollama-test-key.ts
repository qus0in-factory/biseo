import { execFileSync } from 'node:child_process'
import { mkdtempSync } from 'node:fs'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

export function makeOllamaTestKeyPath(): string {
  const dir = mkdtempSync(join(tmpdir(), 'ollama-key-'))
  const keyPath = join(dir, 'id_ed25519')
  execFileSync('ssh-keygen', ['-t', 'ed25519', '-N', '', '-f', keyPath, '-C', 'test'], { stdio: 'ignore' })
  return keyPath
}