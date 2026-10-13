---
name: factory-fix
description: factory:fix 라벨이 붙은 이슈 하나를 구현 → 증명 → 출하 순서로 처리해 PR을 연다. 사용법 `$factory-fix <이슈 번호>`
---

# 이슈 수정

사용자 메시지에서 이슈 번호를 읽는다(예: `$factory-fix 1`이면 1). 아래 `<번호>`는 그 값이다. AGENTS.md의 작업 흐름을 그대로 따른다.

1. **격리 확인**: `pwd`와 `git branch --show-current`로 `.worktrees/issue-<번호>` 안의 `fix/issue-<번호>` 브랜치인지 본다. 아니면 아무것도 고치지 말고 "`scripts/factory fix <번호>`로 다시 시작해 주세요"라고 보고한다.
2. **이슈 읽기**: `gh issue view <번호>`.
3. **재현**: 이슈 본문의 입력값으로 실패하는 테스트를 `test/regression/issue-<번호>.test.js`에 추가하고 `npm test`로 실패를 확인한다. 기존 `test/`의 파일은 사람이 정한 기준이라 고치지 않는다.
4. **수정 전 화면**: `scripts/shot.sh src "<이슈 입력값 쿼리>" evidence/issue-<번호>/before.png`
5. **구현**: 테스트가 통과할 만큼만 고친다.
6. **증명**: `npm test` 전체 통과를 확인하고 `after.png`를 캡처한다. 두 사진을 직접 열어 보고 증상이 사라졌는지 확인한다.
7. **리뷰**: `factory_reviewer` 서브에이전트에게 이슈 번호와 worktree 경로를 넘긴다. FAIL이면 지적을 고치고 5단계부터 다시 한다.
8. **출하**: 커밋 후 push하고 AGENTS.md의 PR 본문 형식으로 PR을 연다. 전후 사진은 `![before](../blob/fix/issue-<번호>/evidence/issue-<번호>/before.png?raw=true)`처럼 브랜치의 파일을 링크한다.
9. 머지는 하지 않는다. PR 주소와 한 일 요약을 **한국어로** 보고하고 끝낸다.
