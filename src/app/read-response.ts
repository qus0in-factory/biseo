import type{CaptureReader}from'./ports.js'
export type ReadResult={text:string|null;error:boolean}
export async function readResponse(r:CaptureReader,ms:number):Promise<ReadResult>{
 try{return {text:await r.read(ms),error:false}}catch{return {text:null,error:true}}
}
