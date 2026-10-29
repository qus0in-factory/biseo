import type { TurnDeps } from './turn-deps.js'

export const ag = (a: string, s: any) => ({
  pane_id: 'w:p1',
  terminal_id: 'term',
  agent_status: 'idle' as const,
  agent: a,
  agent_session: s,
  revision: 1,
})
export const deps = (cap: any) =>
  ({
    herdr: {
      listPanes: async () => [],
      listAgents: async () => [],
      getPane: async () => undefined,
      getAgent: async () => undefined,
      prompt: async () => {},
    },
    capture: { begin: cap },
  }) as unknown as TurnDeps
