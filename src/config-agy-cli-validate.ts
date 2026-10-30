import type{config}from'./config.js'
type C=typeof config
export function validateAgyCliConfig(c:C){
 if(typeof c.agyCliEnabled!=='boolean')throw new Error('agy cli misconfigured')
}
