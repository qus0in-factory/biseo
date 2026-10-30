import {base} from'./config-file.js'
const e=process.env
export const logLevelConfig={logLevel:e.LOG_LEVEL??base.logLevel??'info'}
