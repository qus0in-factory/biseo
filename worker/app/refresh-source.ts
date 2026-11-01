import type { RefreshSession, RefreshPolicy } from '../domain/refresh-types.js'

export type RefreshSource = {
 token(): string
 hash(token: string): Promise<string>
 read(hash: string, host: string): Promise<RefreshSession | null>
 revoke(id: string, now: number): Promise<unknown>
 create(s: RefreshSession, p: RefreshPolicy, now: number): Promise<boolean>
 rotate(s: RefreshSession, hash: string, next: string, now: number,
  idle: number, ip: string): Promise<boolean>
}
