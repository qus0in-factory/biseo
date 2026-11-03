export function renameActionFixture(load = async () => [{paneId: 'p1', name: 'opus2'}]) {
 const events: unknown[] = []
 const s = {
  renameName: 'opus2', load,
  setBusy: (v: boolean) => { events.push(v) },
  setMsg: (v: string | null) => { events.push(v) },
  setRenameId: (v: string | null) => { events.push(['id', v]) },
  setRenameName: (v: string) => { events.push(['name', v]) },
 }
 return {s, events}
}
