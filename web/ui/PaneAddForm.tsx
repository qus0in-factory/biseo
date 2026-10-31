import { usePaneManageState } from '../app/paneManageState'
import { createPaneManageActions } from '../app/paneManageActions'
import { PaneManageOpenForm } from './PaneManageOpenForm'
export function PaneAddForm() {
 const s = usePaneManageState()
 const a = createPaneManageActions(s)
 return <>
  <PaneManageOpenForm template={s.template} name={s.name} busy={s.busy}
   setTemplate={s.setTemplate} setName={s.setName} onOpen={a.open} />
  <p role="status">{s.msg}</p>
 </>
}
