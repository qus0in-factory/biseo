import ky from './sessionHttp'
import { parsePinPreferred } from '../domain/pin-preferred'
import type { PinStatus } from '../domain/pin'

const opts = { retry: 0, credentials: 'same-origin' as const }

export const pinApi = {
  status: () => ky.get('/api/trusted-ip', opts).json<PinStatus>(),
  preferred: () =>
    ky.get('/api/login/pin-preferred', opts).json<unknown>().then(parsePinPreferred),
  trust: () => ky.post('/api/trusted-ip', opts).json(),
  untrust: () => ky.delete('/api/trusted-ip', opts).json(),
  setPin: (pin: string) => ky.put('/api/pin', { ...opts, json: { pin } }).json(),
  clearPin: () => ky.delete('/api/pin', opts).json(),
}
