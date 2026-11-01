import type { D1Database } from '@cloudflare/workers-types'
import { isSafeId } from '../domain/message-input.js'
import { verifyAllowedWorkspace } from '../domain/workspace-guard.js'
import { findTurn } from '../infra/d1-timeline-find.js'

export async function cancelScope(db: D1Database, workspace: string | undefined, owner: string, id: string) {
  const scope = verifyAllowedWorkspace(workspace)
  if (!scope.ok) return { status: scope.status, body: { error: scope.error } }
  if (!isSafeId(id)) return { status: 400, body: { error: 'bad_request' } }
  const row = await findTurn(db, { workspaceId: scope.workspaceId, ownerSubject: owner }, id)
  return row ? null : { status: 404, body: { error: 'not_found' } }
}
