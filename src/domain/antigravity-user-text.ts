export function requestText(raw:string):string{
 const start='<USER_REQUEST>\n'
 const marker='\n</USER_REQUEST>\n<ADDITIONAL_METADATA>\n'
 if(!raw.startsWith(start)||!raw.endsWith('</ADDITIONAL_METADATA>'))return raw
 const end=raw.lastIndexOf(marker)
 return end<start.length?raw:raw.slice(start.length,end)
}
