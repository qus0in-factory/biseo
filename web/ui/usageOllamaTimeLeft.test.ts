import test from'node:test'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{UsageMetricRow}from'./UsageMetricRow'
import{expectNoTimeIcon,expectTimeIcon}from'./usageTimeLeftExpect'
import{metric}from'./usageOllamaFixture.test-util'
import{fromNow}from'./usageRowAssert.test-util'
import r from'../resources.json'
const label=(r as Record<string,string>).usageTimeLeft
const html=(p:string,m:ReturnType<typeof metric>)=>renderToStaticMarkup(
 createElement(UsageMetricRow,{provider:p,metric:m}))
test('included balance is a monthly window',()=>{
 const m=metric('included_balance','currency',{used:0.5,limit:60,remaining:59.5,startsAt:fromNow(-15),resetsAt:fromNow(15)})
 expectTimeIcon(html('ollama',m),label,50)
})
test('purchased and currency rows keep no time column',()=>{
 const m=metric('purchased_balance','currency',{used:null,remaining:7,startsAt:fromNow(-15),resetsAt:fromNow(15)})
 expectNoTimeIcon(html('ollama',m),label)
 expectNoTimeIcon(html('claude',m),label)
})
