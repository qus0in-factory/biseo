export type Reply={id?:string;event?:string;result?:{type?:string};error?:{code?:string}}
export function parseReply(s:string):Reply|null{
 try{const v=JSON.parse(s);return v&&typeof v==='object'?v as Reply:null}catch{return null}
}
