export function trapTabKey(e: KeyboardEvent, nodes?: NodeListOf<HTMLElement>) {
  if (e.key !== 'Tab' || !nodes?.length) return
  const first = nodes[0]
  const last = nodes[nodes.length - 1]
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault()
    last.focus()
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault()
    first.focus()
  }
}
