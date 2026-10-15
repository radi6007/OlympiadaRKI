#!/bin/sh
set -eu
cd "$(dirname "$0")/.."
if [ -x .tools/node/bin/node ]; then
  export PATH="$PWD/.tools/node/bin:$PATH"
fi
if ! command -v npm >/dev/null 2>&1; then
  echo 'Установите Node.js 22.12+ (с npm), затем повторите запуск.' >&2
  exit 1
fi
if [ ! -d node_modules ]; then npm ci; fi
exec npm run dev -- "$@"
