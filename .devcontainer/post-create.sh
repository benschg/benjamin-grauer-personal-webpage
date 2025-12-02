#!/bin/bash
set -e

echo "🚀 Setting up development environment..."

# Initialize Git LFS
echo "🔧 Initializing Git LFS..."
git lfs install --force

# Install Vercel CLI globally (using npm since it's more reliable for global installs)
echo "📦 Installing Vercel CLI..."
npm install -g vercel

# Install Claude Code CLI
echo "🤖 Installing Claude Code CLI..."
npm install -g @anthropic-ai/claude-code

# Install project dependencies
echo "📦 Installing project dependencies..."
cd nextjs && bun install

# Verify installations
echo ""
echo "✅ Setup complete! Installed versions:"
echo "-----------------------------------"
echo "Node.js: $(node --version)"
echo "Bun: $(bun --version)"
echo "Git LFS: $(git lfs version)"
echo "Vercel CLI: $(vercel --version 2>/dev/null || echo 'installed')"
echo "Supabase CLI: $(supabase --version)"
echo "Claude Code CLI: $(claude --version 2>/dev/null || echo 'installed')"
echo ""
echo "🎉 Ready to develop! Run 'cd nextjs && bun dev' to start the dev server."
