// Pool label of a quota model id. Argon before generic gemini-*.
// Internal chat_/tab_ ids are not model quota pools and have no label.
const pools: [string, RegExp][] = [
  ['Gemini 4 Argon', /^gemini-argon-/],
  ['Gemini Models', /^gemini-/],
  ['Claude and GPT models', /^(claude|gpt)-/]
]

export const quotaPool = (modelId: string) =>
  pools.find(([, r]) => r.test(modelId))?.[0] ?? null
