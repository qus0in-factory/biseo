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
    <Card className="mr-auto max-w-[85%] self-start rounded-md rounded-bl-[2px] px-3 py-2 break-words">
      <AgentHeader item={item} onCancel={onCancel} />
      <AgentResult status={status} responseText={responseText} errorCode={errorCode} />
      <TurnErrorDetails code={errorCode} />
      <ReservationRecovery item={item} />
      {cancelError && <span className="text-error">({cancelError})</span>}
    </Card>
  )
}
