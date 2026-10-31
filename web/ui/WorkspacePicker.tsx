import { useEffect, useState } from 'react'
import type { WorkspaceApiPort, WorkspaceSummary } from '../domain/ports'
import { Button } from '../components/ui/button'

export interface WorkspacePickerProps {
  api: WorkspaceApiPort
  onSelected?: (workspaceId: string) => void
}

export function WorkspacePicker({ api, onSelected }: WorkspacePickerProps) {
  const [workspaces, setWorkspaces] = useState<WorkspaceSummary[]>([])
  const [current, setCurrent] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const load = async () => {
    if (!api.listWorkspaces) return
    setLoading(true)
    setError(null)
    try {
      const list = await api.listWorkspaces()
      setWorkspaces(list)
      const cfg = await api.getConfig()
      setCurrent(cfg.workspaceId)
      if (cfg.workspaceId && !list.some((w) => (w.workspaceId ?? w.id) === cfg.workspaceId)) {
        setNotice('selected workspace is no longer available; please select another')
      } else {
        setNotice(null)
      }
    } catch {
      setError('connection_unavailable')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [api])

  const select = async (id: string) => {
    if (!api.selectWorkspace) return
    setLoading(true)
    setError(null)
    try {
      const cfg = await api.selectWorkspace(id)
      setCurrent(cfg.workspaceId)
      setNotice(null)
      onSelected?.(cfg.workspaceId)
      await load()
    } catch {
      setError('connection_unavailable')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section aria-label="workspaces">
      <h2>Workspaces</h2>
      {loading && <p>loading</p>}
      {error && <p>{error}</p>}
      {notice && <p role="alert">{notice}</p>}
      <ul>
        {workspaces.map((w) => {
          const id = w.workspaceId ?? w.id ?? ''
          const selected = id === current
          return (
            <li key={id}>
              <span>{w.label ?? id}</span>
              <span>{id}</span>
              {w.focused ? <span>focused</span> : null}
              {typeof w.paneCount === 'number' ? <span>{w.paneCount} panes</span> : null}
              {selected ? <span>selected</span> : (
                <Button type="button" onClick={() => void select(id)} disabled={loading}>
                  Select
                </Button>
              )}
            </li>
          )
        })}
      </ul>
      {workspaces.length === 0 && !loading && <p>No workspaces</p>}
    </section>
  )
}

export default WorkspacePicker
