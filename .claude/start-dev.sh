#!/bin/zsh
export PATH="/opt/homebrew/opt/node/bin:/opt/homebrew/bin:/usr/local/bin:$PATH"
cd /Users/shahz/Downloads/codelaunch
exec npx next dev --port "${PORT:-3000}"
