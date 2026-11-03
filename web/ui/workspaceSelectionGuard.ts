type Listener = () => void
let pending = false
const listeners = new Set<Listener>()
const emit = () => { for (const listener of listeners) listener() }

const finish = () => {
 if (!pending) return
 pending = false
 emit()
}

export const beginWorkspaceSelection = () => {
 if (pending) return null
 pending = true
 emit()
 return finish
}

export const isWorkspaceSelectionPending = () => pending

export const subscribeWorkspaceSelection = (listener: Listener) => {
 listeners.add(listener)
 return () => { listeners.delete(listener) }
}
