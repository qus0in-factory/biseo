import type{CaptureReader}from'./ports.js'
export async function readResponse(r:CaptureReader,graceMs:number):Promise<string|null>{
 try{return await r.read(graceMs)}catch{return null}
}
