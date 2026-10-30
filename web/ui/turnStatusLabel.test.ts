import assert from'node:assert/strict'
import test from'node:test'
import{turnStatusLabel}from'./turnStatusLabel.js'

const res={turn_timeout:'시간 초과',lateCaptureClosed:'수집 종료'}

test('expired timeout is shown as collection closed',()=>{
 assert.equal(turnStatusLabel('timeout','late_capture_expired',res),'수집 종료')
 assert.equal(turnStatusLabel('timeout','turn_timeout',res),'시간 초과')
 assert.equal(turnStatusLabel('completed',null,res),'completed')
})
