import { useState } from 'react'
import type { WorkspaceApiPort } from '../domain/ports'
import { useWorkspacePicker } from './useWorkspacePicker'
import { missingWorkspaceNotice } from './workspacePickerNotice'
import { pickWorkspace } from './workspacePickerAction'
import { WorkspacePickerView } from './WorkspacePickerView'
import type { WorkspaceSelector } from './workspaceSelectionLink'

export function WorkspacePicker({ api, current, selector, onSelected }: {
 api: WorkspaceApiPort
 current?: string | null
 selector?: WorkspaceSelector | null
 onSelected?: (workspaceId: string) => void
}) {
 const s = useWorkspacePicker(api)
 const [actionError, setActionError] = useState<string | null>(null)
 const shown = current === undefined ? s.cur : current
 const missing = current === undefined ? s.note : missingWorkspaceNotice(shown, s.ws, s.ld, s.err)
 return <WorkspacePickerView state={s.state} current={shown} loading={s.ld}
  notice={actionError ?? missing} onRetry={s.load}
  onSelect={(id) => void pickWorkspace(api, selector, id, s, onSelected, setActionError)}/>
}
