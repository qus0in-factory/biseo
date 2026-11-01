import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{UsagePanelHeader}from'./UsagePanelHeader'
import r from'../resources.json'
const html=(state:'available'|'limited'|'unknown')=>renderToStaticMarkup(createElement(UsagePanelHeader,{provider:{provider:'codex',state,windows:[]}}))
const attr=(name:string,value:string)=>new RegExp(`${name}="${value}"`)
test('provider availability is an icon with an accessible label',()=>{
 const available=html('available')
 assert.match(available,attr('aria-label',r.usage_available))
 assert.match(available,attr('title',r.usage_available))
 assert.doesNotMatch(available,new RegExp(`>${r.usage_available}<`))
 const limited=html('limited')
 assert.match(limited,attr('aria-label',r.usage_limited))
 assert.match(limited,attr('title',r.usage_limited))
 assert.match(limited,/lucide-triangle-alert/)
 assert.match(html('unknown'),attr('aria-label',r.usage_unknown))
})
