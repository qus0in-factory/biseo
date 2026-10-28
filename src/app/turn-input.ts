export type TurnInput={requestId:string;workspaceId:string;paneId:string;text:string}
export function parseInput(v:unknown):TurnInput|string{
 if(!v||typeof v!=='object')return 'invalid_body'
 const o=v as Record<string,unknown>
 for(const k of ['requestId','workspaceId','paneId','text'])if(typeof o[k]!=='string'||!o[k])return 'invalid_body'
 const s=o as TurnInput
 if(s.text.length>8000||s.requestId.length>128)return 'invalid_body'
 return s
}
export function sameInput(i:{workspaceId:string;paneId:string;promptText:string},x:TurnInput){return i.workspaceId===x.workspaceId&&i.paneId===x.paneId&&i.promptText===x.text}

