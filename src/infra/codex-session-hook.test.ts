import test from'node:test'
import{skipCases}from'./codex-session-hook-skip-cases.js'
import{envCase}from'./codex-session-hook-env-case.js'
import{ownerCase}from'./codex-session-hook-owner-case.js'
import{overwriteCase}from'./codex-session-hook-overwrite-case.js'
import{repairCase}from'./codex-session-hook-repair-case.js'
import{writeCase}from'./codex-session-hook-write-case.js'
import{ignoreCase}from'./codex-session-hook-ignore-case.js'
const cases=[...skipCases,envCase,ownerCase,overwriteCase,repairCase,writeCase,ignoreCase]
for(const c of cases)test(c.name,c.run)
