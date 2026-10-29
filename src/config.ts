import {envConfig}from'./config-env.js'
import {serviceConfig}from'./config-service.js'
export const config={...serviceConfig,...envConfig}
