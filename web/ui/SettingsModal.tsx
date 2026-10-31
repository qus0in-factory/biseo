import { Modal } from './Modal'
import { TrustedIpPanel } from './TrustedIpPanel'
import { WorkspacePicker } from './WorkspacePicker'
import { PaneManageSection } from './PaneManageSection'
import { workspaceApi } from '../infra/workspaceApi'
import r from '../resources.json'
import './settings.css'

export function SettingsModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Modal open={open} title={r.settings} onClose={onClose}>
    {open && <div className="settings-content">
      <TrustedIpPanel />
      <WorkspacePicker api={workspaceApi} />
      <PaneManageSection />
    </div>}
  </Modal>
}
