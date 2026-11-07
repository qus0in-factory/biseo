import{readFileSync}from'node:fs'
import{resolve}from'node:path'
import{createAutoLabeler}from'./auto-label.js'
import{logger}from'../infra/logger.js'
import type{AliasRule}from'../domain/auto-label.js'
const file=resolve(process.cwd(),process.env.BISEO_MODEL_ALIASES??'config/model-aliases.json')
let rules:AliasRule[]=[]
try{rules=JSON.parse(readFileSync(file,'utf8'))}catch{}
export const autoLabel=createAutoLabeler(rules,(f,m)=>logger.warn(f,m))
