#!/bin/sh
set -eu

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

exec "$@"
