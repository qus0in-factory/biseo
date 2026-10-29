import {Hono}from'hono'
import type{TurnDeps}from'../app/turn-deps.js'
import {eventsRoute}from'./events-route.js'
import {deleteTurn}from'./delete-turn-route.js'
import {getTurn}from'./get-turn-route.js'
import {panesRoute}from'./panes-route.js'
import {postTurn}from'./post-turn-route.js'
import {requestLogger}from'./request-logger.js'
import {serviceAuth}from'./service-auth.js'
type Deps=TurnDeps&{verify:(t?:string)=>Promise<void>;healthStatus:string;timeoutMs:number;graceMs:number}
export function createApp(d:Deps){
 const app=new Hono()
 app.use('*',requestLogger())
 app.use('/health',serviceAuth(d.verify))
 app.get('/health',c=>c.json({status:d.healthStatus}))
 app.use('/herdr/*',serviceAuth(d.verify))
 app.get('/herdr/workspaces/:wsId/panes',panesRoute(d))
 app.post('/herdr/turns',postTurn(d))
 app.get('/herdr/turns/:requestId',getTurn(d))
 app.delete('/herdr/turns/:requestId',deleteTurn(d))
 app.get('/herdr/events',eventsRoute(d))
 return app
}
