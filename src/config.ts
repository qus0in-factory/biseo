import {envConfig}from'./config-env.js'
import {serviceConfig}from'./config-service.js'
import {logLevelConfig}from'./config-log-level.js'
import {agyCliFlag}from'./config-agy-cli.js'
export const config={...serviceConfig,...envConfig,...logLevelConfig,...agyCliFlag}
