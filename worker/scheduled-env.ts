import type{SessionBindings}from'./ui/types.js'
import type{UpstreamEnv}from'./infra/herdr-upstream-config.js'
export type CronEnv=SessionBindings&UpstreamEnv
