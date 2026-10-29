export type Fake={ids:string[][];events:((e:string)=>void)[];closes:(()=>void)[];closed:number}
export function fakeWatch(){
 const f:Fake={ids:[],events:[],closes:[],closed:0}
 const subscribe=async(ids:string[],onEvent:(e:string)=>void,onClose:()=>void)=>{
  f.ids.push(ids);f.events.push(onEvent);f.closes.push(onClose)
  return()=>{f.closed++}
 }
 return{f,subscribe}
}
export const wait=async(f:()=>boolean)=>{for(let i=0;i<100&&!f();i++)await new Promise(r=>setTimeout(r,1))}
