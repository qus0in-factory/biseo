const closeEvents=['pane_created','pane_closed','pane_moved','pane_exited']
export function isCloseEvent(e:string){return closeEvents.includes(e.replace(/\./g,'_'))}
