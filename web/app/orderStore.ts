import { create } from 'zustand'
import { parseOrder, serializeOrder } from '../domain/order'
export type OrderState={order:string[];save:(ids:string[])=>void}
const initial=(key:string):string[]=>{
 try{return typeof window==='undefined'?[]:parseOrder(localStorage.getItem(key))}catch{return[]}
}
export const createOrderStore=(key:string)=>create<OrderState>(set=>({
 order:initial(key),
 save:(order)=>{set({order});try{localStorage.setItem(key,serializeOrder(order))}catch{}},
}))
