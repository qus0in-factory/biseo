import type{PaneTemplate}from'../infra/pane-templates.js'
import {findPaneTemplate}from'../infra/pane-templates.js'
import {isCoordinatorLabel}from'../infra/coordinator-panels.js'
export type OpenResolved={template?:PaneTemplate;label:string;error?:{s:200|400|403|404|409|502;e:string}}
export function resolveOpenPane(b:Record<string,unknown>|null):OpenResolved{
 const tid=b?.templateId??b?.template
 const raw=b?.name??b?.label
 if(raw!==undefined&&(typeof raw!=='string'||!/^[A-Za-z0-9:_ -]{1,64}$/.test(raw)))return{label:'panel',error:{s:400,e:'invalid_name'}}
 const t=typeof tid==='string'?findPaneTemplate(tid):tid===undefined?undefined:null
 if(t===null)return{label:'panel',error:{s:400,e:'invalid_template'}}
 if(tid!==undefined&&!t)return{label:'panel',error:{s:403,e:'template_not_allowed'}}
 const label=typeof raw==='string'?raw:(t?.label??'panel')
 if(isCoordinatorLabel(label)||isCoordinatorLabel(t?.label))return{label,error:{s:403,e:'coordinator_protected'}}
 return{template:t??undefined,label}
}
