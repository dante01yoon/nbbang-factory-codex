# N빵 계산기 — 팩토리 규칙

이 저장소의 이슈는 에이전트가 먼저 처리하고, 사람은 스펙 승인과 머지만 한다. 이 문서는 목차다. 단계별 절차는 `.agents/skills/`의 스킬에 있다.

## 이슈 처리 흐름: 격리 → 구현 → 증명 → 출하

이슈를 처리할 때의 흐름이다. 사람이 현재 브랜치에서 직접 시킨 작은 수정은 worktree를 만들지 않고 그 자리에서 한다.

1. **격리** — 이슈 하나당 worktree 하나(`.worktrees/issue-<번호>`). `scripts/factory`가 만들어 주고 그 안에서 코덱스를 연다. main에서 직접 고치지 않는다.
2. **구현** — 이슈를 재현하는 실패 테스트를 `test/regression/`에 먼저 쓰고, 그 테스트가 통과할 만큼만 고친다.
3. **증명** — `npm test` 통과, 그리고 `scripts/shot.sh`로 고치기 전·후 화면을 `evidence/issue-<번호>/before.png`, `after.png`로 남긴다. "고쳤다"는 말만으로는 끝난 게 아니다.
4. **출하** — `factory_reviewer` 서브에이전트의 PASS를 받은 뒤 PR을 연다. 머지는 사람이 한다.

## 에이전트가 맡을 수 있는 이슈

| 분류 | 조건 | 할 일 | 라벨 |
|---|---|---|---|
| 바로 수정 | 입력값·증상이 분명하고 테스트로 재현된다. `src/` 파일 2개 이하 변경 | `$factory-fix <번호>` | `factory:fix` |
| 스펙 먼저 | 새 기능이거나 동작을 어떻게 할지 사람이 정해야 한다 | `$factory-spec <번호>` | `factory:spec`, `needs-human` |
| 정보 부족 | 재현할 입력값이 없다 | 이슈에 질문 댓글. 추측으로 고치지 않는다 | `needs-info` |

## 어디에 무엇이 있나

- 이슈 분류: `$factory-triage` — `.agents/skills/factory-triage`
- 이슈 수정: `$factory-fix <번호>` — `.agents/skills/factory-fix`
- 스펙 작성: `$factory-spec <번호>` — `.agents/skills/factory-spec`
- 리뷰어: `factory_reviewer` — `.codex/agents/factory-reviewer.toml`

## 언어

사용자에게 하는 중간 보고와 마지막 보고, 커밋 메시지, PR 본문, 이슈 댓글, 리뷰어 판정은 모두 한국어로 쓴다. 코드·명령·파일 경로·`PASS`/`FAIL` 같은 고정 표기만 원문 그대로 둔다.

## PR 본문 형식

`## Why`(이슈와 사용자 문제) · `## Root cause`(버그일 때) · `## How`(바꾼 것) · `## AS IS / TO BE`(전후 사진) · `## 테스트` · `## 리뷰어 판정`. 첫 줄은 `Fixes #<번호>`.

## 명령

- 테스트: `npm test`
- 화면 캡처: `scripts/shot.sh <src 폴더> "<쿼리>" <저장 경로>`
  예) `scripts/shot.sh src "total=10000&people=3" evidence/issue-1/before.png`

<!-- codex-harness-kit:start -->
## 하네스 규칙

이 프로젝트에는 `.codex/harness/`의 훅이 붙어 있습니다. 설정은 `.codex/harness/harness.json`, 설명은 `docs/harness.md`에 있습니다.

- 보호된 파일은 고치지 않는다: `tests/`, `test/`, `__tests__/`, `/e2e/`, `**/*.test.*`, `**/*.spec.*`, `vitest.config.*`, `vitest.workspace.*`, `jest.config.*`, `playwright.config.*`, `.codex/hooks.json`, `.codex/config.toml`, `.codex/harness/`. 테스트와 검증 설정은 사람이 정한 기준이다.
- 기준을 바꿔야 할 것 같으면 파일을 고치지 말고 멈춘다. 바꿀 파일, 이유, 새 기대값을 정리해 사람에게 넘긴다.
- 훅이 작업을 막으면 다른 방법으로 우회하지 않는다. BLOCKED로 멈추고 막힌 이유와 선택지를 보고한다.
- 응답을 마치기 전에 다음 검증이 자동으로 실행된다. 실패하면 구현 코드를 고친다.
  - `npm test --silent`
- 같은 검증이 계속 실패해 하네스가 자동 반복을 멈추면, 실패한 명령과 원인 추정을 정리해 사람에게 넘긴다.
- `.env` 같은 비밀 파일은 읽거나 쓰지 않는다. 실제 키 대신 테스트 키나 환경 변수 이름을 쓴다.
<!-- codex-harness-kit:end -->
