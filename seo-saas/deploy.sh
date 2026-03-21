#!/bin/bash
# One-command deploy: push + build + redeploy
set -e

echo "=== Pushing to GitHub ==="
cd "$(dirname "$0")"
git add -A .
git commit -m "${1:-update}" 2>/dev/null || echo "Nothing to commit"
git push origin main

echo ""
echo "=== Triggering Coolify build ==="
echo "Waiting 90s for Coolify to build..."
sleep 90

echo ""
echo "=== Deploying new image on server ==="
ssh root@204.168.173.85 '/root/redeploy.sh'

echo ""
echo "=== Done! Site live at http://204.168.173.85 ==="
