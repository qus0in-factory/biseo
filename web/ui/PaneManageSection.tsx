import { useEffect, useState } from 'react'
import { workspaceApi } from '../infra/workspaceApi'
import r from '../resources.json'
type P = { workspaceId?: string }
export function PaneManageSection({ workspaceId }: P) {
  const [ws, setWs] = useState(workspaceId ?? '')
  const [panes, setPanes] = useState<Array<{ paneId: string; name: string }>>([])
  const [template, setTemplate] = useState('opencode')
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  const [confirmId, setConfirmId] = useState<string | null>(null)
  const [renameId, setRenameId] = useState<string | null>(null)
  const [renameName, setRenameName] = useState('')
  const load = async () => {
    try {
      const cfg = await workspaceApi.getConfig()
      const id = cfg.workspaceId
      setWs(id)
      const list = await workspaceApi.getPanes(id)
      setPanes(list.map((p) => ({ paneId: p.paneId, name: p.name })))
    } catch { setMsg('connection_unavailable') }
  }
  useEffect(() => { void load() }, [])
  const open = async () => {
    setBusy(true); setMsg(null)
    try {
      await workspaceApi.openPane?.({ templateId: template, name: name || undefined })
      setMsg(r.paneOpenSuccess); setName(''); await load()
    } catch { setMsg('connection_unavailable') }
    finally { setBusy(false) }
  }
  const close = async (id: string) => {
    setBusy(true); setMsg(null)
    try {
      await workspaceApi.closePane?.(id)
      setMsg(r.paneCloseSuccess); setConfirmId(null); await load()
    } catch { setMsg('connection_unavailable') }
    finally { setBusy(false) }
  }
  const rename = async (id: string) => {
    setBusy(true); setMsg(null)
    try {
      await workspaceApi.renamePane?.(id, renameName)
      setMsg(r.paneRenameSuccess); setRenameId(null); setRenameName(''); await load()
    } catch { setMsg('connection_unavailable') }
    finally { setBusy(false) }
  }
  return (
    <section aria-label={r.paneManageTitle}>
      <h2>{r.paneManageTitle}</h2>
      <div>
        <label>{r.paneTemplateLabel}
          <select value={template} onChange={(e) => setTemplate(e.target.value)} disabled={busy}>
            <option value="opencode">opencode</option>
            <option value="claude">claude</option>
            <option value="codex">codex</option>
          </select>
        </label>
        <label>{r.paneNameLabel}
          <input value={name} onChange={(e) => setName(e.target.value)} disabled={busy} />
        </label>
        <button type="button" onClick={() => void open()} disabled={busy}>{r.openPane}</button>
      </div>
      {msg && <p>{msg}</p>}
      {panes.length === 0 ? <p>{r.paneManageEmpty}</p> : (
        <ul>
          {panes.map((p) => (
            <li key={p.paneId}>
              <span>{p.name}</span>
              {renameId === p.paneId ? (
                <>
                  <input value={renameName} onChange={(e) => setRenameName(e.target.value)} disabled={busy} />
                  <button type="button" onClick={() => void rename(p.paneId)} disabled={busy}>{r.confirm}</button>
                  <button type="button" onClick={() => setRenameId(null)} disabled={busy}>{r.cancel ?? '취소'}</button>
                </>
              ) : (
                <button type="button" onClick={() => { setRenameId(p.paneId); setRenameName(p.name) }} disabled={busy}>{r.renamePane}</button>
              )}
              {confirmId === p.paneId ? (
                <>
                  <span>{r.confirmClose}</span>
                  <button type="button" onClick={() => void close(p.paneId)} disabled={busy}>{r.confirm}</button>
                  <button type="button" onClick={() => setConfirmId(null)} disabled={busy}>{r.cancel ?? '취소'}</button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirmId(p.paneId)} disabled={busy}>{r.closePane}</button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
