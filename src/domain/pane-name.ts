import type{AgentInfo,PaneInfo}from'./herdr.js'
export function paneName(p:PaneInfo,a?:AgentInfo|null){return a?.name??a?.display_agent??p.label??p.pane_id}
