import type{Hono}from'hono'
import type{AppDeps}from'./app-deps.js'
import{deleteTurn}from'./delete-turn-route.js'
import{getTurn}from'./get-turn-route.js'
import{postTurn}from'./post-turn-route.js'
export function registerTurnRoutes(a:Hono,d:AppDeps){
 a.post('/herdr/turns',postTurn(d))
 a.get('/herdr/turns/:requestId',getTurn(d))
 a.delete('/herdr/turns/:requestId',deleteTurn(d))
}
