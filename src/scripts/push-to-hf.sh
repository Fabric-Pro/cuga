#!/bin/bash

# Simple script to push to Hugging Face without large file history issues

echo "=========================================="
echo "Push to Hugging Face (Clean)"
echo "=========================================="
echo ""

# Create orphan branch with current state (no history)
echo "🔄 Creating clean branch..."
TEMP_BRANCH="hf-clean-$(date +%s)"

git checkout --orphan $TEMP_BRANCH || exit 1
git add -A
git commit --no-verify -m "feat: docker-v1 with optimized frontend

- Optimized webpack bundle from 16MB to 6.67MB
- Added HF Space configuration
- Production build with minification
- All files under 10MB limit" || exit 1

echo ""
echo "🚀 Pushing to hf/main..."
git push hf $TEMP_BRANCH:main --force

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Successfully pushed to Hugging Face!"
  git checkout -
  git branch -D $TEMP_BRANCH
else
  echo ""
  echo "❌ Push failed"
  git checkout -
  git branch -D $TEMP_BRANCH
  exit 1
fi