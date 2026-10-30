import type { AgyBucket, AgyGroup } from './agy-quota-types.js'
import { quotaGroup } from './agy-quota-group.js'

// chat_*/tab_*: internal ids, never a family.
const excluded = /^(chat_|tab_)/
// Argon before generic gemini-*.
const families: [string, RegExp][] = [
  ['Gemini 4 Argon', /^gemini-argon-/],
  ['Gemini Models', /^gemini-/],
  ['Claude and GPT models', /^(claude|gpt)-/]
]
const fam = (id: string) => excluded.test(id) ? null : (families.find(([, r]) => r.test(id))?.[0] ?? null)

// bucketId-only payloads stay ungrouped (no confirmed mapping).
export function modelBucketsToGroups(buckets: AgyBucket[]): AgyGroup[] {
  if (!Array.isArray(buckets)) return []
  const known = buckets.filter((b) =>
    typeof b.modelId === 'string' && typeof b.remainingFraction === 'number' && fam(b.modelId))
  const names = [...new Set(known.map((b) => fam(b.modelId as string) as string))]
  return names.map((n) => quotaGroup(n, known.filter((b) => fam(b.modelId as string) === n)))
}
