#!/usr/bin/env python3
"""이 저장소에서 돈 코덱스 세션 기록($CODEX_HOME/sessions/**/*.jsonl, 기본 ~/.codex)을 curator가 읽을 짧은 마크다운으로 줄인다.

사용법: scripts/traces.py <저장소 루트> [--since YYYY-MM-DD] [--sessions <폴더>]
        scripts/traces.py --self-test
"""
import argparse, glob, json, os, sys, tempfile

LIMIT = 1200  # 메시지 하나당 남길 글자 수


def text_of(content):
    return "\n".join(c.get("text", "") for c in content if c.get("type") in ("input_text", "output_text")).strip()


def read_session(path, root):
    meta, prompt, replies = None, None, []
    with open(path, encoding="utf-8") as f:
        for line in f:
            try:
                o = json.loads(line)
            except ValueError:
                continue  # 쓰는 중인 세션의 마지막 줄은 잘려 있을 수 있다
            p = o.get("payload") or {}
            if o.get("type") == "session_meta":
                meta = p
                p["cwd"] = os.path.realpath(p.get("cwd") or "/")
                if not (p["cwd"] + os.sep).startswith(root + os.sep):
                    return None
            elif o.get("type") == "response_item" and p.get("type") == "message":
                t = text_of(p.get("content") or [])
                if p.get("role") == "user" and t and not t.startswith("# AGENTS.md") and "<environment_context>" not in t and prompt is None:
                    prompt = t
                elif p.get("role") == "assistant" and t:
                    replies.append(t)
    if not meta or prompt is None or "$knowledge-curator" in prompt:
        return None
    return {"time": meta.get("timestamp", ""), "cwd": os.path.relpath(meta["cwd"], root), "prompt": prompt, "last": replies[-1] if replies else ""}


def digest(root, since, sessions_dir):
    root = os.path.realpath(root)
    rows = []
    for path in glob.glob(os.path.join(sessions_dir, "**", "*.jsonl"), recursive=True):
        s = read_session(path, root)
        if s and s["time"][:10] >= since:
            rows.append(s)
    rows.sort(key=lambda s: s["time"])
    out = [f"# 실행 기록 ({since} 이후, {len(rows)}개 세션)", ""]
    for s in rows:
        out += [f"## {s['time'][:16]} · {s['cwd']}", "", "**요청**", "", s["prompt"][:LIMIT], "", "**마지막 보고**", "", s["last"][:LIMIT], ""]
    return "\n".join(out)


def self_test():
    with tempfile.TemporaryDirectory() as d:
        repo = os.path.join(d, "repo"); os.makedirs(repo)
        sess = os.path.join(d, "s", "2026", "11", "21"); os.makedirs(sess)
        def write(name, cwd, prompt, reply, ts="2026-11-21T10:00:00Z"):
            lines = [{"type": "session_meta", "payload": {"cwd": cwd, "timestamp": ts}},
                     {"type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": "# AGENTS.md instructions ..."}]}},
                     {"type": "response_item", "payload": {"type": "message", "role": "user", "content": [{"type": "input_text", "text": prompt}]}},
                     {"type": "response_item", "payload": {"type": "message", "role": "assistant", "content": [{"type": "output_text", "text": reply}]}}]
            with open(os.path.join(sess, name), "w") as f:
                f.write("\n".join(json.dumps(x) for x in lines) + "\n{broken")
        write("a.jsonl", os.path.join(repo, ".worktrees", "issue-6"), "$factory-fix 6", "PR #7 열었고 지식 신고 #8")
        write("b.jsonl", "/elsewhere", "다른 저장소", "무시")
        write("c.jsonl", repo, "$knowledge-curator", "curator 자신은 빼기")
        write("d.jsonl", repo, "$factory-fix 5", "옛날 세션", ts="2026-11-01T10:00:00Z")
        out = digest(repo, "2026-11-20", os.path.join(d, "s"))
        assert "1개 세션" in out, out
        assert ".worktrees/issue-6" in out and "신고 #8" in out, out
        assert "다른 저장소" not in out and "curator 자신" not in out and "옛날" not in out, out
    print("self-test ok")


if __name__ == "__main__":
    if sys.argv[1:] == ["--self-test"]:
        self_test(); sys.exit(0)
    ap = argparse.ArgumentParser()
    ap.add_argument("root")
    ap.add_argument("--since", default="1970-01-01")
    ap.add_argument("--sessions", default=os.path.join(os.environ.get("CODEX_HOME") or os.path.expanduser("~/.codex"), "sessions"))
    a = ap.parse_args()
    print(digest(a.root, a.since, a.sessions))
