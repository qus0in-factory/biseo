export type PaneModel={modelId:string;provider:string}
const providers:[RegExp,string][]=[
 [/ollama cloud$/i,'ollama'],
 [/ollama$/i,'ollama'],
 [/openai$/i,'codex'],
 [/codex$/i,'codex'],
 [/claude agent$/i,'claude'],
 [/anthropic$/i,'claude'],
 [/claude$/i,'claude'],
 [/free\s+(?:default\s*\/\s*)?(?:opencode(?:\s+go)?|zen)$/i,'opencode'],
 [/opencode go$/i,'opencode-go'],
 [/(?:default\s*\/\s*)?(?:opencode|zen)$/i,'opencode'],
 [/grok$/i,'grok'],
]
const id=(s:string)=>s.toLowerCase().replace(/[^a-z0-9.]+/g,'-').replace(/^-+|-+$/g,'')
export function parseModelDisplay(display:string,kind:string|null):PaneModel|null{
 const text=display.trim()
 if(!text)return null
 if(kind==='agy')return build(text,'agy')
 const hit=providers.find(([re])=>re.test(text))
 if(!hit)return null
 return build(text.replace(hit[0],''),hit[1])
}
function build(name:string,provider:string):PaneModel|null{
 const modelId=id(name)
 return modelId?{modelId,provider}:null
}
