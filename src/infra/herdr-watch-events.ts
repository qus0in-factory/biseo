const events=['pane_created','pane_closed','pane_moved','pane_exited']
export function isPaneListEvent(e:string){return events.includes(e.replace(/\./g,'_'))}
