import { createOrderStore } from './orderStore'
import r from '../resources.json'
export const usePaneOrderStore=createOrderStore(r.paneOrderStorageKey)
