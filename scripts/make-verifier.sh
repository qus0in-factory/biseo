#!/bin/bash
# 로그인 비밀번호 검증값을 보호 파일로 만든다. 비밀번호는 화면·기록에 남지 않는다.
set -eu
dir="${BISEO_SECRETS_DIR:-$HOME/.config/biseo/secrets}"
out="$dir/password.verifier"
cd "$(dirname "$0")/.."
mkdir -p "$dir" && chmod 700 "$dir"
if [ -e "$out" ]; then
  read -rp "기존 검증값이 있습니다. 새로 만들까요? [y/N] " yn
  [ "$yn" = y ] || { echo "취소했습니다."; exit 1; }
  rm -f "$out"
fi
read -rsp "새 로그인 비밀번호 (12자 이상, 입력이 보이지 않음): " P; echo
read -rsp "한 번 더 입력: " Q; echo
[ "$P" = "$Q" ] || { unset P Q; echo "두 입력이 다릅니다."; exit 1; }
unset Q
printf '%s' "$P" | pnpm exec tsx scripts/make-verifier.ts "$out"; unset P
ls -l "$out" && echo "완료: $out"
