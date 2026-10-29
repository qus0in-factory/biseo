export type Timer=ReturnType<typeof setTimeout>
export type Watch={stop:()=>void;refresh:()=>void}
export type WatchDeps={
 listPanes:()=>Promise<string[]>
 subscribe:(ids:string[],onEvent:(e:string)=>void,onClose:()=>void)=>Promise<()=>void>
 onEvent:(e:string)=>void
 onReady?:()=>void
 onError?:(e:unknown)=>void
 baseMs?:number
 maxMs?:number
}
