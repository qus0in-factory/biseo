import { createContext } from 'react'
import { defaultUsagePace, type UsagePaceKind, type UsagePaceSettings } from '../domain/usagePace'

type Value = { settings: UsagePaceSettings; toggle: (kind: UsagePaceKind) => void }

export const UsagePaceDisplay = createContext<Value>({ settings: defaultUsagePace, toggle: () => {} })
