import type { D1Database } from '@cloudflare/workers-types'

export const insertRow = (db: D1Database, id: string, owner = 'owner', ws = 'w1T', status = 'queued') =>
  db.prepare(`INSERT INTO timeline_turns (request_id,workspace_id,owner_subject,pane_id,target_name,agent_kind,prompt_text,status,response_text,error_code,created_at,updated_at,completed_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`)
    .bind(id, ws, owner, 'w1T:p1', 'p1', null, 'hi', status, null, null, new Date(Date.now() - 5000).toISOString(), new Date().toISOString(), null).run()
