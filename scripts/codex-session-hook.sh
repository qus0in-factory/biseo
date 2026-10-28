#!/bin/sh
set -u
[ -n "${HERDR_PANE_ID:-}" ] || exit 0
b="${BISEO_STATE_DIR:-${HOME:-}/.local/state/biseo}/codex"
k=$(printf '%s' "$HERDR_PANE_ID"|od -An -tx1|tr -d '[:space:]') || exit 0
[ -n "$k" ] || exit 0
p=$(sh "$(dirname "$0")/codex-parent-pid.sh" 2>/dev/null) || p=${PPID:-0}
[ -n "$p" ] || p=${PPID:-0}
umask 077
mkdir -p "$b" 2>/dev/null || exit 0
node -e 'const fs=require("fs"),p=require("path");let t;try{const j=JSON.parse(fs.readFileSync(0,"utf8")),d=process.argv[1],k=process.argv[2],pid=+process.argv[3];if(typeof j.session_id!=="string"||!/^[A-Za-z0-9_-]+$/.test(j.session_id)||typeof j.transcript_path!=="string"||j.transcript_path[0]!=="/"||!(pid>1))throw 0;t=p.join(d,"."+k+"."+process.pid+".tmp");fs.writeFileSync(t,JSON.stringify({session_id:j.session_id,transcript_path:j.transcript_path,pane_id:process.env.HERDR_PANE_ID,pid,created_at:Date.now()}),{mode:0o600,flag:"wx"});fs.renameSync(t,p.join(d,k+".json"))}catch{try{t&&fs.unlinkSync(t)}catch{}}' "$b" "$k" "$p" >/dev/null 2>&1 || exit 0
exit 0
