import type { PaneSummary } from '../domain/timeline'
import { ComposerControls } from './ComposerControls'
import { ComposerCapsule } from './ComposerCapsule'
import { ComposerField } from './ComposerField'
import { ComposerShell } from './ComposerShell'
import { useComposer } from './useComposer'
import type { RecentPull } from './useRecentPull'

type P = {
  target?: PaneSummary
  busy: boolean
  onSend: (s: string) => void
  online?: boolean
  placeholder: string
  pull?: RecentPull
}

export function ComposerBody({ target, busy, onSend, online, placeholder, pull }: P) {
  const { t, setT, ref, canSend, submit, onKey } = useComposer(target, busy, onSend)

  return (
    <ComposerShell onSubmit={submit}>
      <ComposerCapsule>
        <ComposerField inputRef={ref} value={t} onChange={setT} onKey={onKey} placeholder={placeholder} />
        <ComposerControls target={target} busy={busy} can={canSend} online={online} pull={pull} />
      </ComposerCapsule>
    </ComposerShell>
  )
}
