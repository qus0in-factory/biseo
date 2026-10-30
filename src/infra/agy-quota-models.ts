import type { AgyBucket, AgyGroup } from './agy-quota-types.js'
import { quotaGroup } from './agy-quota-group.js'

const F: [string, RegExp][] = [
  ['Gemini Models', /^gemini-/],
  ['Claude and GPT models', /^(claude|gpt)-/],
  ['Gemini 4 Argon', /^chat_/]
]

const fam = (id: string) => F.find(([, r]) => r.test(id))?.[0] ?? null

export function modelBucketsToGroups(buckets: AgyBucket[]): AgyGroup[] {
  if (!Array.isArray(buckets)) return []
  const known = buckets.filter((b) =>
    typeof b.modelId === 'string' && typeof b.remainingFraction === 'number' && fam(b.modelId))
  const names = [...new Set(known.map((b) => fam(b.modelId as string) as string))]
  return names.map((n) => quotaGroup(n, known.filter((b) => fam(b.modelId as string) === n)))
}
