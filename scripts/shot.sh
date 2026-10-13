#!/usr/bin/env bash
# 화면 캡처: src 폴더를 잠깐 서빙하고 headless Chrome으로 PNG를 저장한다.
# 사용법: scripts/shot.sh <src 폴더> "<쿼리>" <저장 경로>
#   예) scripts/shot.sh src "total=10000&people=3" evidence/issue-1/before.png
set -euo pipefail

if [ $# -ne 3 ]; then
  echo "사용법: $0 <src 폴더> \"<쿼리>\" <저장 경로>" >&2
  exit 1
fi
dir=$1 query=$2 out=$3
[ -f "$dir/index.html" ] || { echo "$dir/index.html 이 없습니다." >&2; exit 1; }

chrome=${CHROME:-}
if [ -z "$chrome" ]; then
  for c in "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
           "/Applications/Chromium.app/Contents/MacOS/Chromium" \
           google-chrome chromium chromium-browser; do
    if [ -x "$c" ] || command -v "$c" >/dev/null 2>&1; then chrome=$c; break; fi
  done
fi
[ -n "$chrome" ] || { echo "Chrome을 찾지 못했습니다. CHROME 환경변수로 경로를 지정하세요." >&2; exit 1; }

port=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1])')
profile=$(mktemp -d)
browser=""
python3 -m http.server "$port" --bind 127.0.0.1 --directory "$dir" >/dev/null 2>&1 &
server=$!
trap '{ kill $browser $server; wait; } 2>/dev/null; rm -rf "$profile"' EXIT

for _ in $(seq 50); do
  curl -sf "http://127.0.0.1:$port/" >/dev/null && break
  sleep 0.1
done

mkdir -p "$(dirname "$out")"
abs_out="$(cd "$(dirname "$out")" && pwd)/$(basename "$out")"
rm -f "$abs_out"

# macOS의 headless Chrome은 캡처 뒤에도 종료되지 않을 때가 있어, 파일이 다 써지면 직접 끈다.
"$chrome" --headless=new --disable-gpu --hide-scrollbars --no-first-run \
  --user-data-dir="$profile" --window-size=480,720 --virtual-time-budget=2000 \
  --screenshot="$abs_out" "http://127.0.0.1:$port/?$query" >/dev/null 2>&1 &
browser=$!

last=-1
for _ in $(seq 150); do
  size=$(stat -f %z "$abs_out" 2>/dev/null || stat -c %s "$abs_out" 2>/dev/null || echo 0)
  [ "$size" -gt 0 ] && [ "$size" = "$last" ] && break
  kill -0 $browser 2>/dev/null || [ "$size" -gt 0 ] || break
  last=$size
  sleep 0.2
done

[ -s "$abs_out" ] || { echo "캡처 실패: $out 이 만들어지지 않았습니다." >&2; exit 1; }
echo "$out"
