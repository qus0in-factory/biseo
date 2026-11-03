import { useState } from 'react'
import { Modal } from './Modal'
import { SettingsTabs } from './SettingsTabs'
import { PaneAddModal } from './PaneAddModal'
import r from '../resources.json'
import './settings.css'
import './settings-panels.css'
import './workspace-picker.css'
import './settings-workspaces.css'
import './workspace-tab.css'
import './settings-tabs.css'
export function SettingsModal({open, onClose}: {open: boolean; onClose: () => void}) {
 const [adding, setAdding] = useState(false)
 const [tab, setTab] = useState('security')
 return <>
  <Modal open={open && !adding} title={r.settings} onClose={onClose}>
   {open && <SettingsTabs tab={tab} setTab={setTab} onAdd={() => setAdding(true)} />}
  </Modal>
  <PaneAddModal open={open && adding} onClose={() => setAdding(false)} />
 </>
}
