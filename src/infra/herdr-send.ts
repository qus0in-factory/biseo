import {call}from'./herdr-exec.js'
export async function sendKeys(id:string,keys:string){await call(['pane','send-keys',id,keys],15000)}
