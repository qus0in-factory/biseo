import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{UsageTabs}from'./UsageTabs'
const p=(provider:string)=>({provider,state:'available'as const,windows:[]})
test('usage provider tabs render in given order and keep the bookmark tab',()=>{
 const html=renderToStaticMarkup(createElement(UsageTabs,{
  providers:[p('ollama'),p('claude'),p('agy')],bookmarks:['agy'],onToggleBookmark(){},
  remaining:true,tab:'ollama',onTabChange(){},onMove(){},
 }))
 assert.ok(html.indexOf('ollama')<html.indexOf('claude'))
 assert.ok(html.indexOf('claude')<html.indexOf('agy'))
 assert.match(html,/북마크/)
})
