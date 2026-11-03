import type { TimelineItem } from '../domain/timeline'
import { AgentHeader } from './AgentHeader'
import { AgentResult } from './AgentResult'
import { TurnErrorDetails } from './TurnErrorDetails'
import { Card } from '../components/ui/card'
import { ReservationRecovery } from './ReservationRecovery'

export function AgentBubble({
  item,
  onCancel,
}: {
  item: TimelineItem
  onCancel?: (id: string) => void
}) {
  const { status, responseText, errorCode, cancelError } = item
  return (
    <Card className="mr-auto max-w-[85%] self-start rounded-2xl rounded-bl-xs border border-border/40 bg-card/60 px-3.5 py-2.5 break-words shadow-none">
      <AgentHeader item={item} onCancel={onCancel} />
      <AgentResult status={status} responseText={responseText} errorCode={errorCode} />
      <TurnErrorDetails code={errorCode} />
      <ReservationRecovery item={item} />
      {cancelError && <span className="text-error">({cancelError})</span>}
    </Card>
  )
}
