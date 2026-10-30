import{base}from'./config-file.js'
const e=process.env
export const o={
 ollamaIncludedUsd:Number(e.OLLAMA_INCLUDED_USD??base.ollamaIncludedUsd),
 availabilityTtlMs:Number(e.AVAILABILITY_TTL_MS??base.availabilityTtlMs),
 logLevel:e.LOG_LEVEL??base.logLevel??'info'
}
