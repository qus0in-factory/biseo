import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
export function configPath(env: string | undefined, fallback: string): string {
  return env ? resolve(process.cwd(), env) : fileURLToPath(fallback)
}
