import type{Hono}from'hono'
import{workspaceConfig as wc}from'./workspace-config-route.js'
import{workspacesRoute as wr,selectWorkspaceRoute as sw}from'./workspaces-route.js'
import{deleteTurn as dt}from'./delete-turn-route.js'
import{eventsRoute as er}from'./events-route.js'
import{getTurn as gt}from'./get-turn-route.js'
import{interruptRoute as ir}from'./interrupt-route.js'
import{panesRoute as pr}from'./panes-route.js'
import{postTurn as pt}from'./post-turn-route.js'
import{serviceAuth as sa}from'./service-auth.js'
import{usageRoute as ur}from'./usage-route.js'
import type{AppDeps}from'./app-deps.js'
export function registerRoutes(a:Hono,d:AppDeps){
 const v=sa(d.verify)
 a.use('/health',v)
 a.get('/health',c=>c.json({status:d.healthStatus}))
 a.use('/herdr/*',v)
 if(d.usageCollector)a.get('/herdr/usage',ur(d.usageCollector))
 a.get('/herdr/config',wc(d))
 a.get('/herdr/workspaces',wr(d))
 a.post('/herdr/workspaces/select',sw(d))
 a.get('/herdr/workspaces/:wsId/panes',pr(d))
 a.post('/herdr/panes/:paneId/interrupt',ir(d))
 a.post('/herdr/turns',pt(d))
 a.get('/herdr/turns/:requestId',gt(d))
 a.delete('/herdr/turns/:requestId',dt(d))
 a.get('/herdr/events',er(d))}