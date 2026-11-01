import{test}from'node:test'
import{strict as a}from'node:assert'
import{retryInput}from'./retryReservation'
test('manual retries use fresh request IDs and original workspace with selected pane',()=>{
  const item={requestId:'old',workspaceId:'original'} as any
  const bodies=[retryInput(item,'p2'),retryInput(item,'p3')]
  a.notEqual(bodies[0].requestId,'old');a.notEqual(bodies[0].requestId,bodies[1].requestId)
  a.equal(bodies[0].workspaceId,'original');a.equal(bodies[1].paneId,'p3')
})
