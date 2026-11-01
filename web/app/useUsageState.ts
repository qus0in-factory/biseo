import{useState}from'react'
import type{AsyncState}from'../domain/asyncState'
import{loadingState}from'../domain/asyncState'
import type{UsageProvider}from'../domain/usage'
export function useUsageState(){
 return useState<AsyncState<UsageProvider[]>>(()=>loadingState())
}
