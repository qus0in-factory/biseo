import type { PaneSummary } from '../domain/timeline'
import { getPaneState } from '../domain/paneState'
import { InterruptButton } from './InterruptButton'
import { ReasonTip } from './ReasonTip'
import r from '../resources.json'

export function ComposerStatus({ target, online }: { target?: PaneSummary; online?: boolean }) {
  const { reason } = getPaneState(target)
  const err = reason ? (r as Record<string, string>)[reason] ?? reason : null
  if (!err && target?.status !== 'blocked') return null
  return <div className="order-first flex w-full items-center gap-3 px-1 md:order-none md:w-auto md:gap-1.5 md:px-0">
    <InterruptButton key={target?.paneId ?? 'none'} target={target} online={online} />
    {err && <ReasonTip text={err} />}
  </div>
}
