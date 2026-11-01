import{createElement}from'react'
import{renderToStaticMarkup}from'react-dom/server'
import{PaneManagePaneItem}from'./PaneManagePaneItem'
import type{PaneSummary}from'../domain/timeline'
import type{UsageProvider}from'../domain/usage'
export const ollama:UsageProvider[]=[{provider:'ollama',state:'available',windows:[
 {window:'included_balance',usedPercent:1,resetsAt:null,checkedAt:null,limitReached:false,source:null},
]}]
export const renderPaneItem=(over:Partial<PaneSummary>,providers:UsageProvider[]=[])=>renderToStaticMarkup(
 createElement(PaneManagePaneItem,{
  p:{paneId:'p1',name:'panel',status:'idle',sendable:true,disabledReason:null,...over},
  providers,busy:false,confirmId:null,renameId:null,renameName:'',
  setConfirmId(){},setRenameId(){},setRenameName(){},onClose(){},onRename(){},
 }))
