import ky from 'ky'
import { refreshSession } from './refreshSession'

const sessionHttp = ky.create({
 hooks: { afterResponse: [async ({ request, options, response }) => {
  const path = new URL(request.url).pathname
  if (response.status !== 401 || options.context.sessionRetried ||
   ['/api/login','/api/login/pin','/api/logout','/api/refresh'].includes(path)) return
  await refreshSession()
  return sessionHttp(request, {
   ...options, context: { ...options.context, sessionRetried: true },
  })
 }] },
})
export default sessionHttp
