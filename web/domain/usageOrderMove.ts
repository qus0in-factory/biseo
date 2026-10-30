export const moveUsageIdTo = (
  list: string[],
  id: string,
  to: number
): string[] => {
  const from = list.indexOf(id)
  if (from < 0) return list
  const x = Math.max(0, Math.min(list.length - 1, to))
  if (from === x) return list
  const n = [...list]
  n.splice(from, 1)
  n.splice(x, 0, id)
  return n
}

export const reorderUsageIds = (
  list: string[],
  from: number,
  to: number
): string[] =>
  from < 0 || to < 0 || from >= list.length || to >= list.length
    ? list
    : moveUsageIdTo(list, list[from], to)
