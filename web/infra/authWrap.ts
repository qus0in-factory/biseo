import { HTTPError } from 'ky'
import { ApiError, loginCode } from '../domain/auth'

export async function authWrap<T>(fn: () => Promise<T>): Promise<T> {
 try { return await fn() }
 catch (e) {
  const s = e instanceof HTTPError ? e.response.status : undefined
  throw new ApiError(loginCode(s))
 }
}
