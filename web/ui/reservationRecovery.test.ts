import{test}from'node:test'
import{strict as a}from'node:assert'
import{turnStatusLabel}from'./turnStatusLabel'
import r from'../resources.json'
test('uncertain delivery and unclear target have distinct timeline labels and guidance',()=>{
 a.equal(turnStatusLabel('failed','delivery_uncertain',r),r.delivery_uncertain)
 a.equal(turnStatusLabel('failed','target_unclear',r),r.target_unclear)
 a.notEqual(r.delivery_uncertain,r.target_unclear)
 a.match(r.reservationDuplicateWarning,/중복/)
 a.ok(r.reservationRetry);a.ok(r.reservationTarget)
})
