import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{UsageMetricRow}from'./UsageMetricRow'
import{assertFixedValueColumns,fromNow,percentMetric}from'./usageRowAssert.test-util'
import r from'../resources.json'
const label=(r as Record<string,string>).usageTimeLeft
test('metric rows keep the value and time columns even without a clock',()=>{
 const withTime=renderToStaticMarkup(createElement(UsageMetricRow,{provider:'claude',metric:percentMetric(fromNow(3.5))}))
 const withoutTime=renderToStaticMarkup(createElement(UsageMetricRow,{provider:'claude',metric:percentMetric(null)}))
 assertFixedValueColumns(withTime)
 assertFixedValueColumns(withoutTime)
 assert.match(withTime,new RegExp(`aria-label="${label}"`))
 assert.doesNotMatch(withoutTime,new RegExp(`aria-label="${label}"`))
})
