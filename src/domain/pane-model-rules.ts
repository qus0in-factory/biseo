import { readFileSync } from 'node:fs'
import { configPath } from './config-path.js'
type Rule = { re: string; provider: string }
const file = configPath(process.env.BISEO_MODEL_SUFFIXES, new URL('../../config/model-suffixes.json', import.meta.url))
export const modelSuffixes: [RegExp, string][] = JSON.parse(readFileSync(file, 'utf8')).map((r: Rule) => [new RegExp(r.re, 'i'), r.provider])
