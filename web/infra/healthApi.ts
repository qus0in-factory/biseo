import ky, { HTTPError } from 'ky'
import { ApiError, loginCode, type Health, type HealthPort } from '../domain/auth'

export const healthApi: HealthPort = {
  async getHealth() {
    try {
      return await ky
        .get('/api/health', { retry: 0, credentials: 'same-origin' })
        .json<Health>()
    } catch (e) {
      const s = e instanceof HTTPError ? e.response.status : undefined
      throw new ApiError(loginCode(s))
    }
  },
}
