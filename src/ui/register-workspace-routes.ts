import type{Hono}from'hono'
import{workspaceConfig as wc}from'./workspace-config-route.js'
import{workspacesRoute as wr}from'./workspaces-route.js'
import{selectWorkspaceRoute as sw}from'./workspaces-select-route.js'
import type{AppDeps}from'./app-deps.js'
export function registerWorkspaceRoutes(a:Hono,d:AppDeps){
 a.get('/herdr/config',wc(d))
 a.get('/herdr/workspaces',wr(d))
 a.post('/herdr/workspaces/select',sw(d))
}