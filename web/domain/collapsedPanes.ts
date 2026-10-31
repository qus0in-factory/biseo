import r from '../resources.json'

export function parsePaneListExpanded(value: string | null): boolean {
  return value === 'true'
}

export function selectCollapsedPanes<T>(ordered: readonly T[], expanded = false): T[] {
  return expanded ? [...ordered] : ordered.slice(0, Number(r.collapsedPanesCount))
}
