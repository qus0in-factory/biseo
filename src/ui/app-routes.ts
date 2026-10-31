import type{Hono}from'hono'
import{registerWorkspaceRoutes as rws}from'./register-workspace-routes.js'
import{eventsRoute as er}from'./events-route.js'
import{interruptRoute as ir}from'./interrupt-route.js'
import{panesRoute as pr}from'./panes-route.js'
import{registerPaneManage}from'./pane-manage-routes.js'
import{registerTurnRoutes}from'./turn-routes.js'
import{serviceAuth as sa}from'./service-auth.js'
import type{AppDeps}from'./app-deps.js'
import{registerExecutorRoutes}from'./executor-routes.js'
export function registerRoutes(a:Hono,d:AppDeps){
 const v=sa(d.verify)
 a.use('/health',v)
 a.get('/health',c=>c.json({status:d.healthStatus}))
 a.use('/herdr/*',v)
 rws(a,d)
 registerExecutorRoutes(a,d)
 a.get('/herdr/workspaces/:wsId/panes',pr(d))
 a.post('/herdr/panes/:paneId/interrupt',ir(d))
 registerPaneManage(a,d)
 registerTurnRoutes(a,d)
 a.get('/herdr/events',er(d))}
