import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
type Rule = { re: string; provider: string }
const env = process.env.BISEO_MODEL_SUFFIXES
const file = env ? resolve(process.cwd(), env) : fileURLToPath(new URL('../../config/model-suffixes.json', import.meta.url))
export const modelSuffixes: [RegExp, string][] = JSON.parse(readFileSync(file, 'utf8')).map((r: Rule) => [new RegExp(r.re, 'i'), r.provider])
