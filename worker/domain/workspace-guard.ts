export type WorkspaceCheck =
  | { ok: true; workspaceId: string }
  | { ok: false; status: 403 | 500; error: string; reason?: string }

export function verifyAllowedWorkspace(
  allowed: string | undefined,
  requested?: string | null,
): WorkspaceCheck {
  const configured = allowed?.trim()
  if (!configured) return { ok: false, status: 500, error: 'misconfigured' }
  if (requested === undefined) return { ok: true, workspaceId: configured }
  if (!requested || requested !== configured) {
    return {
      ok: false,
      status: 403,
      error: 'forbidden',
      reason: 'workspace_not_allowed',
    }
  }
  return { ok: true, workspaceId: configured }
}
