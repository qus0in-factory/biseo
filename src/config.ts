import {envConfig}from'./config-env.js'
import {serviceConfig}from'./config-service.js'
import {logLevelConfig}from'./config-log-level.js'
export const config={...serviceConfig,...envConfig,...logLevelConfig}
