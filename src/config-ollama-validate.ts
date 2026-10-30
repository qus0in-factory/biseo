import type{config}from'./config.js'
type C=typeof config
export function validateOllamaConfig(c:C){
 if(!(Number(c.ollamaIncludedUsd)>0))throw new Error('ollama included usd misconfigured')
}
