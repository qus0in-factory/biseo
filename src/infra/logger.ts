import {pino,type DestinationStream,type Logger}from'pino'
import {config}from'../config.js'
const redact=['*.token','*.secret','*.cookie','*.password','*.authorization','*.text','headers.authorization','headers.cookie']
export function createLogger(level=process.env.LOG_LEVEL??config.logLevel??'info',stream?:DestinationStream):Logger{
 return pino({level,redact},stream)
}
export const logger=createLogger()
