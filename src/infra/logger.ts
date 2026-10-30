import {pino,type DestinationStream,type Logger}from'pino'
const redact=['*.token','*.secret','*.cookie','*.password','*.authorization','*.text','headers.authorization','headers.cookie']
export function createLogger(level=process.env.LOG_LEVEL??'info',stream?:DestinationStream):Logger{
 return pino({level,redact},stream)
}
export const logger=createLogger()
