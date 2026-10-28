#!/bin/sh
# Finds the nearest ancestor whose executable is codex.
p=${1:-${PPID:-0}}
while [ "$p" -gt 1 ]; do
 c=$(ps -o comm= -p "$p" 2>/dev/null) || break
 case "$c" in *codex*) printf '%s\n' "$p"; exit 0;; esac
 p=$(ps -o ppid= -p "$p" 2>/dev/null | tr -d ' ') || break
 [ -n "$p" ] || break
done
