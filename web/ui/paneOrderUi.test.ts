import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{PanesList}from'./PanesList'
const panes=['p1','p2','p3','p4'].map((id,i)=>({paneId:id,name:`name-${i+1}`,status:'idle'as const,sendable:true,disabledReason:null}))
const names=(html:string)=>[...html.matchAll(/<strong[^>]*>([^<]+)<\/strong>/g)].map(m=>m[1])
test('collapsed panel list shows the first three ids in stored order',()=>{
 const view={panes:[panes[2],panes[0],panes[1],panes[3]],register:()=>()=>{},move(){}}
 const html=renderToStaticMarkup(createElement(PanesList,{view,selectedId:null,onSelect(){}}))
 assert.deepEqual(names(html),['name-3','name-1','name-2'])
})
