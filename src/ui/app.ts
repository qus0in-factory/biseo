import {Hono}from'hono'
import {registerRoutes}from'./app-routes.js'
import {requestLogger}from'./request-logger.js'
import {securityHeaders}from'./security-headers.js'
import type{AppDeps}from'./app-deps.js'
export function createApp(d:AppDeps){
 const app=new Hono()
 app.use('*',securityHeaders)
 app.use('*',requestLogger())
 registerRoutes(app,d)
 return app
}
