import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { PanesViewLayout } from './PanesViewLayout'

const src=(f:string)=>readFileSync(new URL(f,import.meta.url),'utf8')
const panes=Array.from({length:8},(_,i)=>({paneId:`p${i}`,name:`pane ${i}`,status:'idle'as const,sendable:true,disabledReason:null}))
test('expanded list fills the drawer and scrolls inside',()=>{
 const html=renderToStaticMarkup(createElement(PanesViewLayout,{panes,selectedId:null,onSelect(){},register:()=>()=>{},onMove(){}}))
 assert.equal((html.match(/<li/g)??[]).length,8)
 assert.doesNotMatch(html,/max-height/)
 assert.match(html,/min-h-0 flex-1 overflow-y-auto/)
 for(const f of['./PaneDrawerContent.tsx','./paneDrawerClass.ts','./DashboardView.tsx','../components/ui/sheet.content.tsx'])assert.match(src(f),/min-h-0/)
})
