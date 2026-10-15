#!/bin/sh
# Convenience for the already installed, isolated MySQL on this Mac.
set -eu
cd "$(dirname "$0")/.."
if [ -x .tools/node/bin/node ]; then export PATH="$PWD/.tools/node/bin:$PATH"; fi
case "${1:-start}" in
 start)
  if [ ! -x .tools/mysql/bin/mysqld ] || [ ! -d .tools/mysql-data/mysql ]; then
    echo 'Локальная MySQL ещё не установлена. См. docs/BACKEND.md.' >&2; exit 1
  fi
  if [ -f .tools/mysql-data/mysql.pid ] && kill -0 "$(cat .tools/mysql-data/mysql.pid)" 2>/dev/null; then
    echo 'Локальная MySQL уже работает.'; exit 0
  fi
  exec .tools/mysql/bin/mysqld --no-defaults --daemonize --basedir="$PWD/.tools/mysql" --datadir="$PWD/.tools/mysql-data" --bind-address=127.0.0.1 --port=3307 --socket=/tmp/olympiad-rki-mysql.sock --mysqlx=OFF --log-error="$PWD/.tools/mysql-data/error.log" --pid-file="$PWD/.tools/mysql-data/mysql.pid"
  ;;
 stop)
  node --input-type=module <<'JS'
import fs from 'node:fs';import mysql from 'mysql2/promise';
const {rootPassword}=JSON.parse(fs.readFileSync('.private/local-mysql.json','utf8'));
const c=await mysql.createConnection({socketPath:'/tmp/olympiad-rki-mysql.sock',user:'root',password:rootPassword});
await c.query('SHUTDOWN');await c.end();
JS
  ;;
 *) echo 'Usage: ./scripts/mysql-local.sh [start|stop]' >&2; exit 1;;
esac
