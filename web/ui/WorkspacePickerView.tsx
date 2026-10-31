import type { WorkspaceSummary } from '../domain/ports'
import { WorkspacePickerItem } from './WorkspacePickerItem'
export interface WorkspacePickerViewProps {
  workspaces: WorkspaceSummary[]
  current: string | null
  loading: boolean
  error: string | null
  notice: string | null
  onSelect: (id: string) => void
}
export function WorkspacePickerView(p: WorkspacePickerViewProps) {
  return (
    <section aria-label="workspaces">
      <h2>Workspaces</h2>
      {p.loading && <p>loading</p>}
      {p.error && <p>{p.error}</p>}
      {p.notice && <p role="alert">{p.notice}</p>}
      <ul>
        {p.workspaces.map((w) => {
          const id = w.workspaceId ?? w.id ?? ''
          return <WorkspacePickerItem key={id} workspace={w} selected={id === p.current} loading={p.loading} onSelect={p.onSelect} />
        })}
      </ul>
      {p.workspaces.length === 0 && !p.loading && <p>No workspaces</p>}
    </section>
  )
}
export default WorkspacePickerView