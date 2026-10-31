import type{AgentInfo,PaneInfo}from'../domain/herdr.js'
import {call,notFound}from'./herdr-exec.js'
import {withCodex,withCodexAll}from'./herdr-codex.js'
export async function listPanes(ws:string){const r=await call(['pane','list','--workspace',ws],15000);return withCodexAll((r.result?.panes??[]) as PaneInfo[])}
export async function listAgents(){const r=await call(['agent','list'],15000);return withCodexAll((r.result?.agents??[]) as AgentInfo[])}
export async function getPane(id:string){try{const r=await call(['pane','get',id],15000);return withCodex(r.result?.pane as PaneInfo|undefined)}catch(e){if(notFound(e))return;throw e}}
export async function getAgent(id:string){try{const r=await call(['agent','get',id],15000);return withCodex(r.result?.agent as AgentInfo|undefined)}catch(e){if(notFound(e))return;throw e}}export async function closePane(id:string){await call(['pane','close',id],15000)}
export async function renamePane(id:string,label:string){await call(['pane','rename',id,label],15000)}
