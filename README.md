# N빵 계산기 — 코덱스 소프트웨어 팩토리

총 금액과 인원을 넣으면 1인당 낼 돈을 계산하는 작은 웹 앱에, 코덱스로 **이슈가 PR이 되는 라인**을 붙인 실습 저장소입니다. 이슈를 분류하고, 재현 테스트를 먼저 쓰고, 고치고, 전후 화면 사진과 리뷰어 판정을 붙여 PR을 엽니다. 머지는 사람이 합니다.

```text
AGENTS.md                       팩토리 규칙 (목차)
.agents/skills/                 factory-triage · factory-fix · factory-spec
.codex/agents/                  factory-reviewer.toml (리뷰어 서브에이전트)
.codex/harness/, hooks.json     codex-harness-kit (가드·검증 훅)
scripts/factory                 이슈 하나를 worktree에서 코덱스로 여는 실행기
scripts/shot.sh                 headless Chrome 전후 화면 캡처
test/                           사람이 정한 테스트 (에이전트는 고치지 않음)
test/regression/                에이전트가 이슈마다 추가하는 재현 테스트
```

## 준비

- [Codex CLI](https://developers.openai.com/codex) (이 저장소는 0.162.1로 실행), `gh`(로그인), Node(이 저장소는 24로 실행), Python 3.9+, Chrome
- GitHub에 이 저장소를 내 계정으로 가져가 이슈를 몇 개 올립니다.

## 하네스 입히기

```bash
git clone https://github.com/dante01yoon/codex-harness-kit.git ~/codex-harness-kit
python3 ~/codex-harness-kit/install.py . --lang ko
python3 .codex/harness/harness.py doctor
```

팩토리에 맞게 `.codex/harness/harness.json`의 `protect.paths`에 네 줄을 더했습니다. 기존 테스트와 팩토리 설정은 에이전트가 못 고치고, `test/regression/`만 열어 둡니다.

```bash
jq '.protect.paths += [".codex/agents/", ".agents/skills/", "scripts/factory", "!test/regression/"]' \
  .codex/harness/harness.json > h.json && mv h.json .codex/harness/harness.json
```

처음 `codex`를 열면 훅 검토 창이 뜹니다. 내용을 확인하고 신뢰해야 훅이 동작합니다(`/hooks`).

## 라인 돌리기

```bash
scripts/factory triage        # 열린 이슈를 바로 수정 / 스펙 먼저 / 정보 부족으로 분류
scripts/factory fix 1         # 이슈 #1: 재현 테스트 → 수정 → 전후 사진 → 리뷰어 → PR
scripts/factory spec 2        # 이슈 #2: 코드 대신 스펙 문서 draft PR
codex exec '$factory-triage'  # 같은 스킬을 비대화형으로 (자동화용)
```

이 저장소에서 실제로 돌린 결과: [PR #4](../../pull/4)(수정), [PR #5](../../pull/5)(스펙, draft).

## 알아 둘 것

- 이 실습은 일회용 저장소라 샌드박스와 승인 질문을 끄고(YOLO) 돌렸습니다. 실제 프로젝트에서는 컨테이너나 승인 규칙과 함께 쓰세요. 훅은 테스트와 팩토리 설정을 지키는 장치이지 샌드박스가 아닙니다.
- 이슈 처리용 worktree는 `.worktrees/`에 만들어지며 git에서 제외됩니다.

## 참고

- OpenAI, [Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) (2026-02-11)
- [codex-harness-kit](https://github.com/dante01yoon/codex-harness-kit)
