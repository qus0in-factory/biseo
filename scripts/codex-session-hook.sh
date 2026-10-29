#!/bin/sh
set -u
d=$(dirname "$0")
p=$(sh "$d/codex-parent-pid.sh" 2>/dev/null) || p=${PPID:-0}
[ -n "$p" ] || p=${PPID:-0}
node "$d/codex-session-write.mjs" "$p" >/dev/null 2>&1
exit 0
