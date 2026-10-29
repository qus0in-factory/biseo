const turns=new Map<string,number>()
export function beginTurn(pane:string){const g=(turns.get(pane)??0)+1;turns.set(pane,g);return g}
export function isCurrentTurn(pane:string,g:number){return (turns.get(pane)??0)===g}
