import { logger } from '../infra/logger.js'

export type AuditLog = { info(obj: object, msg: string): void }

export function interruptAudit(
  log: AuditLog | undefined,
  paneId: string,
  key: string,
  result: string,
): void {
  const safe = (v: string, n: number) => v.replace(/[^\x20-\x7e]/g, '').slice(0, n)
  ;(log ?? logger).info({ paneId: safe(paneId, 128), key: safe(key, 32), result }, 'pane.interrupt')
}
