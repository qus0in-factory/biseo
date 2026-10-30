// Pool label of a quota model id. Argon before generic gemini-*; internal chat/tab
// ids keep a generic group so their usage is not dropped.
const pools: [string, RegExp][] = [
  ['Gemini 4 Argon', /^gemini-argon-/],
  ['Gemini Models', /^gemini-/],
  ['Claude and GPT models', /^(claude|gpt)-/],
  ['Chat sessions', /^(chat_|tab_)/]
]

export const quotaPool = (modelId: string) =>
  pools.find(([, r]) => r.test(modelId))?.[0] ?? null
