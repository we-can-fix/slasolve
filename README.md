# SLASolve

A modern platform for managing Service Level Agreements with automated code review and merge capabilities.

## 🌟 Features

- 🤖 **Auto-Fix Bot** - Intelligent code analysis and automatic fixing
- 🔍 **Automatic Code Review** - Automated PR review with comprehensive checks
- 🔀 **Auto-Merge** - Automatic merging to main branch after successful review
- 📊 **Quality Monitoring** - Real-time code quality metrics and reports
- ☁️ **Cloud Delegation** - Distributed task processing with cloud agents

## 📁 Structure

- `core/` - Core platform services
  - `contracts/` - Contract management services
    - `contracts-L1/` - Layer 1 contract management
      - `contracts/` - Core contract service implementation
- `.github/` - GitHub Actions workflows
  - `workflows/` - CI/CD automation
    - `auto-review-merge.yml` - Automated review and merge workflow
  - `scripts/` - Helper scripts for automation
- `docs/` - Documentation
  - `AUTO_REVIEW_MERGE.md` - Auto review and merge documentation

## 🚀 Getting Started

See individual service README files for specific setup instructions.

## 🤖 Auto Review & Merge

This repository includes an automated review and merge workflow that:

1. **Automatically reviews** all Pull Requests
2. **Fixes common issues** like unused imports and formatting
3. **Auto-merges** approved PRs to the main branch

For detailed information, see [Auto Review & Merge Documentation](docs/AUTO_REVIEW_MERGE.md).

### Quick Start

The workflow runs automatically on:
- PR creation
- PR updates
- PR ready for review

No additional setup required! 🎉

## 📚 Documentation

- [Auto Review & Merge Guide](docs/AUTO_REVIEW_MERGE.md)
- [Auto-Fix Bot Guide](AUTO_FIX_BOT_GUIDE.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [Security Policy](SECURITY.md)