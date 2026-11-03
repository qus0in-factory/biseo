export const plain = (r: unknown) => (r ? { ...(r as Record<string, unknown>) } : null)
export const meta = (r: any) => ({ changes: Number(r?.changes ?? 0), last_row_id: Number(r?.lastInsertRowid ?? 0), changed_db: true, duration: 0 })
