import type { PaneSummary } from './timeline'
import { makeTestPane } from './pane-usage-test-helper'
export const observedPanes: PaneSummary[] = [
  ['opus-5.5', 'claude'], ['gemini-3.8-flash', 'agy'],
  ['gpt-6.1-sol', 'codex'], ['deepseek-v4.1-flash', 'ollama'], ['beam', 'opencode'],
].map(([modelId, modelProvider], i) => ({
  ...makeTestPane(i === 1 ? 'agy' : 'opencode', `unrelated-${i}`),
  paneId: `w1T:p${i}`, modelId, modelProvider,
}))
