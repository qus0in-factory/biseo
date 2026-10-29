import{registerTimelineList}from'./timeline-read-list.js'
import{registerTimelineSingle}from'./timeline-read-single.js'
import{registerSubmitRoute}from'./timeline-submit-route.js'
import type{App}from'./timeline-guards.js'
export function registerTimelineMessages(app:App){
 registerSubmitRoute(app)
 registerTimelineList(app)
 registerTimelineSingle(app)
}
