import { parseOllamaKey } from './ollama-key.js'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { homedir } from 'node:os'
export async function readOllamaAuthorize(): Promise<((challenge: string) => string) | null> {
  const p = process.env.BISEO_OLLAMA_KEY_PATH ?? join(homedir(), '.ollama', 'id_ed25519')
  try {
    const pem = await readFile(p, 'utf8')
    return parseOllamaKey(pem)
  } catch {
    return null
  }
}
