import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs'
import { TrustedIpPanel } from './TrustedIpPanel'
import { WorkspacePicker } from './WorkspacePicker'
import { PaneManageSection } from './PaneManageSection'
import { workspaceApi } from '../infra/workspaceApi'
import r from '../resources.json'
type P = {onAdd: () => void; tab: string; setTab: (tab: string) => void}
export function SettingsTabs({onAdd, tab, setTab}: P) {
 return <Tabs value={tab} onValueChange={setTab} className="settings-content">
  <TabsList>{['security', 'workspace', 'panels'].map((id, i) =>
   <TabsTrigger key={id} value={id}>{[r.securityTab, r.workspaceTab, r.panelsTab][i]}</TabsTrigger>)}</TabsList>
  <TabsContent value="security"><TrustedIpPanel /></TabsContent>
  <TabsContent value="workspace"><WorkspacePicker api={workspaceApi} /></TabsContent>
  <TabsContent value="panels"><PaneManageSection onAdd={onAdd} /></TabsContent>
 </Tabs>
}
