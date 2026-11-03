export interface SelectionGate {
  begin(): number
  isCurrent(token: number): boolean
}

export const createSelectionGate = (): SelectionGate => {
  let current = 0
  return {
    begin: () => ++current,
    isCurrent: (token) => token === current,
  }
}

export const applySelectedWorkspace = (
  gate: SelectionGate,
  token: number,
  workspaceId: string,
  apply: (workspaceId: string) => void,
): boolean => {
  if (!gate.isCurrent(token)) return false
  apply(workspaceId)
  return true
}
