import type { RefreshSource } from '../app/refresh-source.js'
import { refreshSecret, refreshHash } from './refresh-secret.js'
import { readRefresh, revokeRefresh } from './refresh-read.js'
import { createRefresh } from './refresh-create.js'
import { rotateRefresh } from './refresh-rotate.js'

export function refreshSource(db: D1Database): RefreshSource {
 return {
  token: refreshSecret, hash: refreshHash,
  read: (hash,host) => readRefresh(db,hash,host),
  revoke: (id,now) => revokeRefresh(db,id,now),
  create: (s,p,now) => createRefresh(db,s,p,now),
  rotate: (s,hash,next,now,idle,ip) => rotateRefresh(db,s,hash,next,now,idle,ip),
 }
}
