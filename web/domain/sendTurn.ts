import type { WorkspaceApiPort, SendMessageInput } from './ports'
import type { PaneSummary, TimelineItem } from './timeline'
import { makeOptimistic } from './optimistic'

export function prepareTurn(
  w: string,
  t: PaneSummary,
  text: string,
): { item: TimelineItem; input: SendMessageInput } {
  const { requestId, item } = makeOptimistic(w, t, text)
  return {
    item,
    input: { requestId, workspaceId: w, paneId: t.paneId, text },
  }
}

export async function submitTurn(
  p: WorkspaceApiPort,
  input: SendMessageInput,
): Promise<void> {
  await p.sendMessage(input)
}
