import type { AgyResolved } from './agy-token-result.js'
import { settleAgyToken } from './agy-token-settle.js'
import { withAgyFlight, resetAgyTokenState } from './agy-token-memory.js'

export const clearAgyTokenCache = resetAgyTokenState

export const resolveAgyToken = (now = new Date()) => withAgyFlight(() => settleAgyToken(now.getTime()))
