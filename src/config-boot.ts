import type{config}from'./config.js'
import{validateConfig}from'./config-validation.js'
import{validateOllamaConfig}from'./config-ollama-validate.js'
type C=typeof config
export const bootValidators:((c:C)=>void)[]=[validateConfig,validateOllamaConfig]
export function validateBootConfig(c:C){
 for(const v of bootValidators)v(c)
}
