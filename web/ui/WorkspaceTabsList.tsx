import type { WorkspaceSummary } from '../domain/ports'
import r from '../resources.json'

type P = {
 items: WorkspaceSummary[]
 current: string | null
 busy: boolean
 target: string | null
 onSelect: (id: string) => void
}

export function WorkspaceTabsList({ items, current, busy, target, onSelect }: P) {
 return <div className="workspace-tabs" role="group" aria-label={r.workspaceSwitch}
  title={r.workspaceSwitchHint}>
  {items.map(workspace => {
   const id = workspace.workspaceId ?? workspace.id ?? ''
   const selected = id === current
   const pending = busy && target === id
   const meta = pending ? r.workspaceSwitchPending
    : [selected ? r.workspaceSelected : null, workspace.focused ? r.workspaceFocused : null]
     .filter(Boolean).join(' · ')
   return <button key={id} type="button" className={`workspace-tab${selected ? ' workspace-tab-current' : ''}`}
    aria-current={selected ? 'true' : undefined} aria-busy={pending || undefined} disabled={busy}
    onClick={() => onSelect(id)}>
    <span className="workspace-tab-name">{workspace.label ?? id}</span>
    {meta && <span className="workspace-tab-meta">{meta}</span>}
   </button>
  })}
 </div>
}
