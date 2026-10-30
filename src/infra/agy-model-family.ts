export type AgyModelFamily = 'argon' | 'gemini' | 'claude' | 'gpt' | 'unknown'

// Family detection reads only the model ids the agy quota API returns.
// Aliases and CLI names are never used to infer a family; unmatched ids stay unknown.
const rules: [AgyModelFamily, RegExp][] = [
  ['argon', /^gemini-argon-/],
  ['gemini', /^gemini-/],
  ['claude', /^claude-/],
  ['gpt', /^gpt-/],
]

export const modelFamily = (modelId: string): AgyModelFamily =>
  rules.find(([, re]) => re.test(modelId))?.[0] ?? 'unknown'

// One quota pool can cover several families (claude and gpt share the 3p pool).
export const familyKey = (families: readonly string[]): string => {
  const known = families.filter((f) => f !== 'unknown')
  if (known.length === 0) return 'unknown'
  return known.length === 1 ? known[0] : known.join('-')
}
