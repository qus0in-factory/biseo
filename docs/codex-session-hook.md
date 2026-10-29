---
audience: user
---
# Codex 세션 연결 hook

## Why

Herdr가 Codex 세션 ID를 서버에 보고하지 못하면 pane의 `agent_session`이 비어 있어 Biseo가 Codex 응답을 수집할 수 없다. Biseo 소유 SessionStart hook이 세션 ID와 rollout 경로를 보호된 상태 파일에 기록하고, 백엔드가 pane 조회 결과를 보강한다.

## What

- hook은 Codex의 `SessionStart` 입력에서 `session_id`·`transcript_path`를 읽고 `HERDR_PANE_ID`·Codex PID·기록 시각과 함께 기록한다.
- Codex는 hook을 공유 app-server daemon에서 실행할 수 있다. 이때 daemon 환경의 `HERDR_PANE_ID`는 daemon을 처음 띄운 pane(폐기된 workspace 포함)의 값이라 실제 세션 pane과 다를 수 있다. hook은 `herdr agent list`에서 같은 `session_id`를 가진 pane을 찾아 그 pane으로 기록하고, 확인할 수 없으면 잘못된 pane에 쓰지 않고 종료한다.
- 기록 위치: `${BISEO_STATE_DIR:-~/.local/state/biseo}/codex/<pane id hex>.json`, 권한 `0600`, 원자적 교체.
- 백엔드는 `BISEO_CODEX_DIR`(기본 `~/.codex/sessions`) 하위의 `transcript_path`만 사용하며, 기록된 PID가 죽었거나 명령이 Codex가 아니면 기록을 무시한다.
- 기록에는 세션 ID·transcript 경로·pane ID·PID·`created_at`만 있으며 대화 본문은 저장하지 않는다.
- hook은 Codex 환경의 `PATH`에서 `node`와 `herdr`(`HERDR_BIN_PATH` 우선)를 찾아야 한다. 없으면 기록 없이 조용히 종료한다.

## How

1. `~/.codex/hooks.json`의 `hooks.SessionStart` 배열에 아래 항목을 **새 그룹으로 추가**한다. Herdr가 관리하는 `~/.codex/herdr-agent-state.sh` 그룹과 기존 항목은 수정·삭제하지 않는다. `scripts/codex-session-hook.sh`와 같은 디렉터리에 `codex-parent-pid.sh`·`codex-pane.mjs`·`codex-session-write.mjs`가 함께 있어야 한다.

```json
{
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/absolute/path/to/biseo/scripts/codex-session-hook.sh",
            "timeout": 10
          }
        ]
      }
    ]
  }
}
```

2. Codex에서 `/hooks`를 열어 새 hook을 검토·신뢰한다. 변경된 hook은 신뢰 전까지 건너뛰어질 수 있다.
3. 새 Codex 세션을 시작한 뒤 상태 파일과 권한을 확인한다.

```sh
ls -l "${BISEO_STATE_DIR:-$HOME/.local/state/biseo}/codex"
```

4. `BISEO_STATE_DIR`나 `BISEO_CODEX_DIR`를 바꾸면 hook을 실행하는 Codex 환경과 백엔드(PM2) 환경에 같은 값을 설정한다. 경로가 다르면 백엔드는 기록을 찾지 못하거나 transcript를 거부한다.
5. Biseo pane 목록을 새로 고치면 Codex pane의 `agent_session`이 `{agent:"codex", kind:"id", source:"biseo:codex", value:"<session_id>"}`로 보강된다.

## Troubleshooting

- 상태 파일이 없으면 `codex`의 `/hooks`에서 항목이 `trusted`인지, hook 환경 `PATH`에 `node`가 있는지 확인한다.
- `herdr agent list`에 해당 세션이 실제 pane으로 보이는지 확인한다. 보이지 않고 `HERDR_PANE_ID`의 workspace가 이미 없으면 hook은 잘못된 pane 기록을 만들지 않는다.
- hook은 어떤 실패(누락된 pane ID, 잘못된 JSON, 권한 오류)에서도 출력 없이 `0`으로 종료하므로 Codex 세션 시작을 막지 않는다.
