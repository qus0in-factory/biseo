type L = Record<string, string>
export const usagePercentText = (v: number | null, unk: string) => (v === null ? unk : `${v}%`)
export const usageWindowName = (p: string, w: string, l: L) => l[`usageWindow_${p}_${w}`] ?? l[`usageWindow_${w}`] ?? w
