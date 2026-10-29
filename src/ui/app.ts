import {Hono}from'hono'
import {registerRoutes}from'./app-routes.js'
import {requestLogger}from'./request-logger.js'
import type{AppDeps}from'./app-deps.js'
export function createApp(d:AppDeps){
 const app=new Hono()
 app.use('*',requestLogger())
 registerRoutes(app,d)
 return app
}
