# 지식 (docs/knowledge)

에이전트가 일할 때 참고하는 이 프로젝트의 지식이다. 계산 규칙, 용어, 모임의 관례처럼 코드만 봐서는 알 수 없는 것을 적는다.

- 작업 에이전트는 읽기만 한다. 빠졌거나 틀린 지식은 `$knowledge-flag`로 신고한다.
- 고치는 것은 `$knowledge-curator`(scripts/curator가 매일 밤 실행)와 그 PR을 머지하는 사람이다.

## 파일 형식

파일 하나에 주제 하나. 앞부분에 YAML을 둔다.

```markdown
---
type: rule            # rule | term | convention
sources:              # 근거: 이슈·PR 번호, 사람의 말이 있던 곳
  - PR #4 리뷰 댓글
verified: 2026-11-21  # 사람이 머지한 날
stale_after: 2027-05-21
---
# 제목

규칙 본문. 예시 입력과 기대 결과를 하나 이상 적는다.
```

## 목록

(아직 없음)
