import { HTTPError } from 'ky'
import ky from './sessionHttp'
import { ApiError, loginCode, type Health, type HealthPort } from '../domain/auth'

export const healthApi: HealthPort = {
  async getHealth(signal?: AbortSignal) {
    try {
      return await ky
        .get('/api/health', { retry: 0, credentials: 'same-origin', signal })
        .json<Health>()
    } catch (e) {
      if (signal?.aborted || (e as { name?: string } | null)?.name === 'AbortError') throw e
      const s = e instanceof HTTPError ? e.response.status : undefined
      throw new ApiError(loginCode(s))
    }
  },
}
