import { parseGrokBilling } from './grok-billing-parse.js'
import { requestGrokBilling } from './grok-billing-request.js'
import { billingFailure as fail, type GrokResult } from './grok-billing-result.js'

export async function queryGrokBilling(token: string, now: Date): Promise<GrokResult> {
  let res: Response
  try {
    res = await requestGrokBilling(token)
  } catch {
    return fail('temporarily_unavailable', 'request')
  }
  if (!res.ok) return fail(res.status === 401 || res.status === 403
    ? 'auth_required' : 'temporarily_unavailable', 'http', res.status)
  try {
    const usage = parseGrokBilling(await res.json(), now)
    return usage.state === 'unknown' ? fail('schema_error', 'parse', res.status) : { usage }
  } catch (error) {
    const timeout = error instanceof Error && /^(Abort|Timeout)Error$/.test(error.name)
    return fail(timeout ? 'temporarily_unavailable' : 'schema_error', 'json', res.status)
  }
}
