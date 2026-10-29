import type{Hono}from'hono'
import {deleteTurn}from'./delete-turn-route.js'
import {eventsRoute}from'./events-route.js'
import {getTurn}from'./get-turn-route.js'
import {interruptRoute}from'./interrupt-route.js'
import {panesRoute}from'./panes-route.js'
import {postTurn}from'./post-turn-route.js'
import {serviceAuth}from'./service-auth.js'
import type{AppDeps}from'./app-deps.js'
export function registerRoutes(app:Hono,d:AppDeps){
 app.use('/health',serviceAuth(d.verify))
 app.get('/health',c=>c.json({status:d.healthStatus}))
 app.use('/herdr/*',serviceAuth(d.verify))
 app.get('/herdr/workspaces/:wsId/panes',panesRoute(d))
 app.post('/herdr/panes/:paneId/interrupt',interruptRoute(d))
 app.post('/herdr/turns',postTurn(d))
 app.get('/herdr/turns/:requestId',getTurn(d))
 app.delete('/herdr/turns/:requestId',deleteTurn(d))
 app.get('/herdr/events',eventsRoute(d))
}
