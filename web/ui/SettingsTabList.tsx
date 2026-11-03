import { TabsList, TabsTrigger } from '../components/ui/tabs'
import r from '../resources.json'
export function SettingsTabList() {
 return <TabsList className="settings-tabs">
  {(['security', 'workspace', 'panels'] as const).map((id, i) =>
   <TabsTrigger key={id} value={id} className="workspace-tab">
    {[r.securityTab, r.workspaceTab, r.panelsTab][i]}
   </TabsTrigger>)}
 </TabsList>
}
