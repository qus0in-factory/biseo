const paneEvents=['pane.created','pane.closed','pane.updated','pane.moved','pane.exited','pane.agent_detected']
export function subscriptionLine(paneIds:string[]){
 const subscriptions=[...paneEvents.map(type=>({type})),...paneIds.map(pane_id=>({type:'pane.agent_status_changed',pane_id}))]
 return JSON.stringify({id:'sub',method:'events.subscribe',params:{subscriptions}})+'\n'
}
