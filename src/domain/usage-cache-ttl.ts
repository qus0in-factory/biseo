const e=process.env
export const getClaudeCacheTtlMs=():number=>Number(e.BISEO_CLAUDE_CACHE_TTL_MS??1.8e6)
