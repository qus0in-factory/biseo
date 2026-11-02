const FAMILY=/^(?:Gemini|Claude|Gemma|Llama|Qwen|Mistral|Grok|DeepSeek)\s+[A-Za-z0-9][A-Za-z0-9.() _-]*$|^GPT-[A-Za-z0-9][A-Za-z0-9.() _-]*$/i
export function agyModel(value:string):string|null{
 const text=value.trim()
 return FAMILY.test(text)?text:null
}
