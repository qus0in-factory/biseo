import{base}from'./config-file.js'
const e=process.env
export const ollamaConfig={
 ollamaIncludedUsd:Number(e.OLLAMA_INCLUDED_USD??base.ollamaIncludedUsd)
}
