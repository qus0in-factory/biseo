import type{D1Database}from'@cloudflare/workers-types'
export type DbEnv={BISEO_DB?:D1Database}
export const getDb=(e:DbEnv)=>e.BISEO_DB??null
