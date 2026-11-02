import test from'node:test'
import assert from'node:assert/strict'
import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{CollapsedPanePreview}from'./CollapsedPanePreview'
const panes=Array.from({length:5},(_,i)=>({paneId:`p${i}`,name:`pane-${i}`,status:'idle'as const,sendable:true,disabledReason:null}))
test('collapsed preview always shows three panes in order',()=>{
 const html=renderToStaticMarkup(createElement(CollapsedPanePreview,{panes,selectedId:null,onSelect(){}}))
 assert.equal((html.match(/<li/g)??[]).length,3)
 assert.match(html,/pane-0/)
 assert.match(html,/pane-2/)
})
