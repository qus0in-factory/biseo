import test from'node:test'
import assert from'node:assert/strict'
import{readFileSync}from'node:fs'
const src=(f:string)=>readFileSync(new URL(f,import.meta.url),'utf8')

test('main entry and settings picker share the controller selector',()=>{
 assert.match(src('./WorkspaceSection.tsx'),/linkWorkspaceSelector\(c\.selectWorkspace\)/)
 assert.match(src('./WorkspaceDashboard.tsx'),/workspaceId=\{c\.wsId\}[\s\S]*onSelectWorkspace=\{c\.selectWorkspace\}/)
 assert.match(src('./DashboardView.tsx'),/<WorkspaceSwitcher[^>]*select=\{props\.onSelectWorkspace\}/)
 assert.match(src('./WorkspacePicker.tsx'),/pickWorkspace\(api, selector, id, s, onSelected, setActionError\)/)
 assert.match(src('./workspacePickerAction.ts'),/resolveWorkspaceSelector\(api\)/)
})
