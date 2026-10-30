import type { AgyBucket, AgyGroup } from './agy-quota-types.js'
import { quotaGroup } from './agy-quota-group.js'

// Argon before generic gemini-*; internal chat/tab ids keep a generic group so usage is not dropped.
const families: [string, RegExp][] = [
  ['Gemini 4 Argon', /^gemini-argon-/],
  ['Gemini Models', /^gemini-/],
  ['Claude and GPT models', /^(claude|gpt)-/],
  ['Chat sessions', /^(chat_|tab_)/]
]
const fam = (id: string) => families.find(([, r]) => r.test(id))?.[0] ?? null

// bucketId-only payloads stay ungrouped (no confirmed mapping).
export function modelBucketsToGroups(buckets: AgyBucket[]): AgyGroup[] {
  if (!Array.isArray(buckets)) return []
  const known = buckets.filter((b) =>
    typeof b.modelId === 'string' && typeof b.remainingFraction === 'number' && fam(b.modelId))
  const names = [...new Set(known.map((b) => fam(b.modelId as string) as string))]
  return names.map((n) => quotaGroup(n, known.filter((b) => fam(b.modelId as string) === n)))
}
