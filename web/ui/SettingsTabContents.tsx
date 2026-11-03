import { TabsContent } from '../components/ui/tabs'
import { TrustedIpPanel } from './TrustedIpPanel'
import { WorkspacePicker } from './WorkspacePicker'
import { PaneManageSection } from './PaneManageSection'
import { workspaceApi } from '../infra/workspaceApi'
export function SettingsTabContents({onAdd}: {onAdd: () => void}) {
 return <>
  <TabsContent value="security"><TrustedIpPanel /></TabsContent>
  <TabsContent value="workspace"><WorkspacePicker api={workspaceApi} /></TabsContent>
  <TabsContent value="panels"><PaneManageSection onAdd={onAdd} /></TabsContent>
 </>
}
