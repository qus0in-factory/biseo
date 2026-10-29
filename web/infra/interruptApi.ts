import ky from 'ky'
import { INTERRUPT_KEY, type InterruptKey } from '../domain/interrupt'

export type InterruptResult =
  | { ok: true; status: number }
  | { ok: false; status: number; conflict: boolean }

const opts = { retry: 0, credentials: 'same-origin' as const }

export async function postInterrupt(
  paneId: string,
  key: InterruptKey = INTERRUPT_KEY,
): Promise<InterruptResult> {
  try {
    const res = await ky.post(
      `/api/panes/${encodeURIComponent(paneId)}/interrupt`,
      { ...opts, json: { key } },
    )
    return { ok: true, status: res.status }
  } catch (err: unknown) {
    const res = (err as { response?: Response })?.response
    const status = res?.status ?? 500
    return { ok: false, status, conflict: status === 409 }
  }
}
