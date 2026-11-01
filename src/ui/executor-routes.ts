import type{Hono}from'hono'
import type{AppDeps}from'./app-deps.js'
import{usageRoute}from'./usage-route.js'
import{queueTargetRoute}from'./queue-target-route.js'
import{executeReservationRoute}from'./execute-reservation-route.js'
export function registerExecutorRoutes(a:Hono,d:AppDeps){
 a.get('/herdr/queue/workspaces/:wsId/panes/:paneId',queueTargetRoute(d))
 a.post('/herdr/queue/execute',executeReservationRoute(d))
 if(d.usageCollector)a.get('/herdr/usage',usageRoute(d.usageCollector))
}
