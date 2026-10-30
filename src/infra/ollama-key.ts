import { readFile } from 'node:fs/promises'
import { readOuter } from './ollama-key-outer.js'
import { buildSigner } from './ollama-key-inner.js'
export function parseOllamaKey(pem: string): (challenge: string) => string {
  const match = pem.match(/^-----BEGIN OPENSSH PRIVATE KEY-----\s+([A-Za-z0-9+/=\s]+)-----END OPENSSH PRIVATE KEY-----\s*$/)
  if (!match?.[1]) throw new Error('bad pem')
  const bytes = Buffer.from(match[1].replace(/\s/g, ''), 'base64')
  const { publicBlob, inner } = readOuter(bytes)
  return buildSigner(publicBlob, inner)
}
export async function readOllamaKey(path: string): Promise<string> {
  return readFile(path, 'utf8')
}
