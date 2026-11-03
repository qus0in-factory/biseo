import { test } from 'node:test'
import { strict as a } from 'node:assert'
import { turnStatusLabel } from './turnStatusLabel'
import r from '../resources.json'
import assert from 'node:assert/strict'
import import5_test from 'node:test'

test('uncertain delivery and unclear target have distinct timeline labels and guidance',()=>{
 a.equal(turnStatusLabel('failed','delivery_uncertain',r),r.delivery_uncertain)
 a.equal(turnStatusLabel('failed','target_unclear',r),r.target_unclear)
 a.notEqual(r.delivery_uncertain,r.target_unclear)
 a.match(r.reservationDuplicateWarning,/중복/)
 a.ok(r.reservationRetry);a.ok(r.reservationTarget)
})
{
const test = import5_test;
const res={turn_timeout:'시간 초과',lateCaptureClosed:'수집 종료'}

test('expired timeout is shown as collection closed',()=>{
 assert.equal(turnStatusLabel('timeout','late_capture_expired',res),'수집 종료')
 assert.equal(turnStatusLabel('timeout','turn_timeout',res),'시간 초과')
 assert.equal(turnStatusLabel('completed',null,res),'completed')
})
}
