import { Tabs } from '../components/ui/tabs'
import { SettingsTabList } from './SettingsTabList'
import { SettingsTabContents } from './SettingsTabContents'
type P = {onAdd: () => void; tab: string; setTab: (tab: string) => void}
export function SettingsTabs({onAdd, tab, setTab}: P) {
 return <Tabs value={tab} onValueChange={setTab} className="settings-content">
  <SettingsTabList />
  <SettingsTabContents onAdd={onAdd} />
 </Tabs>
}
