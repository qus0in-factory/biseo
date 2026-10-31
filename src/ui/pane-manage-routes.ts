import type{Hono}from'hono'
import type{AppDeps}from'./app-deps.js'
import{openPaneRoute}from'./panes-open-route.js'
import{closePaneRoute}from'./panes-close-route.js'
import{renamePaneRoute}from'./panes-rename-route.js'
export function registerPaneManage(a:Hono,d:AppDeps){
 a.post('/herdr/panes',openPaneRoute(d))
 a.delete('/herdr/panes/:paneId',closePaneRoute(d))
 a.post('/herdr/panes/:paneId/rename',renamePaneRoute(d))
}
