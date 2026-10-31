import type{Hono}from'hono'
import{deleteTurn as dt}from'./delete-turn-route.js'
import{eventsRoute as er}from'./events-route.js'
import{getTurn as gt}from'./get-turn-route.js'
import{interruptRoute as ir}from'./interrupt-route.js'
import{panesRoute as pr}from'./panes-route.js'
import{postTurn as pt}from'./post-turn-route.js'
import{serviceAuth as sa}from'./service-auth.js'
import type{AppDeps}from'./app-deps.js'
import{registerExecutorRoutes}from'./executor-routes.js'
export function registerRoutes(a:Hono,d:AppDeps){
 const v=sa(d.verify)
 a.use('/health',v)
 a.get('/health',c=>c.json({status:d.healthStatus}))
 a.use('/herdr/*',v)
 registerExecutorRoutes(a,d)
 a.get('/herdr/workspaces/:wsId/panes',pr(d))
 a.post('/herdr/panes/:paneId/interrupt',ir(d))
 a.post('/herdr/turns',pt(d))
 a.get('/herdr/turns/:requestId',gt(d))
 a.delete('/herdr/turns/:requestId',dt(d))
 a.get('/herdr/events',er(d))}
