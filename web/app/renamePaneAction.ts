import r from '../resources.json'
type State = {
 renameName: string; setBusy: (v: boolean) => void; setMsg: (v: string | null) => void
 setRenameId: (v: string | null) => void; setRenameName: (v: string) => void
 load: () => Promise<{paneId: string; name: string}[]>
}
export async function renamePaneAction(s: State, rename: (id: string, name: string) => Promise<void>, id: string) {
 s.setBusy(true); s.setMsg(null)
 try {
  await rename(id, s.renameName)
  const panes = await s.load()
  if (!panes.some(p => p.paneId === id && p.name === s.renameName)) throw Error()
  window.dispatchEvent(new Event(r.panesChangedEvent))
  s.setRenameId(null); s.setRenameName(''); s.setMsg(r.paneRenameSuccess)
 } catch { s.setMsg(r.paneRenameFailed) }
 finally { s.setBusy(false) }
}
