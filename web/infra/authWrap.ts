import { HTTPError } from 'ky'
import { ApiError, loginCode } from '../domain/auth'

export async function authWrap<T>(fn: () => Promise<T>): Promise<T> {
 try { return await fn() }
 catch (e) {
  const response = e instanceof HTTPError ? e.response :
   e instanceof Error && 'response' in e && e.response instanceof Response ? e.response : undefined
  const s = response?.status
  throw new ApiError(loginCode(s))
 }
}
