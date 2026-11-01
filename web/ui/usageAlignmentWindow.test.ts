import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{UsageWindowRow}from'./UsageWindowRow'
import{assertFixedValueColumns,fromNow,percentValue}from'./usageRowAssert.test-util'
import r from'../resources.json'
const label=(r as Record<string,string>).usageTimeLeft
test('window rows share the same fixed value columns',()=>{
 const withTime=renderToStaticMarkup(createElement(UsageWindowRow,{provider:'codex',value:percentValue(fromNow(3.5))}))
 const withoutTime=renderToStaticMarkup(createElement(UsageWindowRow,{provider:'codex',value:percentValue(null)}))
 assertFixedValueColumns(withTime)
 assertFixedValueColumns(withoutTime)
 assert.match(withTime,new RegExp(`aria-label="${label}"`))
 assert.doesNotMatch(withoutTime,new RegExp(`aria-label="${label}"`))
})
