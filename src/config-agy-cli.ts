import{base}from'./config-file.js'
const v=process.env.BISEO_AGY_CLI_ENABLED
export const agyCliFlag={agyCliEnabled:v==='1'?true:v==='0'?false:base.agyCliEnabled??true}
