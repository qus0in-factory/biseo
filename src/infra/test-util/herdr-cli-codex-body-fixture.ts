import{panes}from'./herdr-cli-codex-panes-fixture.js'
import{agents}from'./herdr-cli-codex-agents-fixture.js'
export const body=[
 ['pane list',JSON.stringify({result:{panes}})],
 ['agent list',JSON.stringify({result:{agents}})],
 ['pane get',JSON.stringify({result:{pane:panes[0]}})],
 ['agent get',JSON.stringify({result:{agent:agents[0]}})],
].map(([k,v])=>`  "${k}") echo '${v}';;`).join('\n')
