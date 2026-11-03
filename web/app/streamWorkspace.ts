export const belongsToWorkspace = (active: string | null, eventWorkspaceId: string): boolean =>
  active !== null && active === eventWorkspaceId
