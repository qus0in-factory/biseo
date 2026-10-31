import ky from 'ky'
import type { PinStatus } from '../domain/pin'

const opts = { retry: 0, credentials: 'same-origin' as const }

export const pinApi = {
  status: () => ky.get('/api/trusted-ip', opts).json<PinStatus>(),
  trust: () => ky.post('/api/trusted-ip', opts).json(),
  untrust: () => ky.delete('/api/trusted-ip', opts).json(),
  setPin: (pin: string) => ky.put('/api/pin', { ...opts, json: { pin } }).json(),
  clearPin: () => ky.delete('/api/pin', opts).json(),
}
