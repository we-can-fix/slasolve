# SLASolve

A modern platform for managing Service Level Agreements with automated code review and merge capabilities.

## 🌟 Features

- 🤖 **Auto-Fix Bot** - Intelligent code analysis and automatic fixing
- 🔍 **Automatic Code Review** - Automated PR review with comprehensive checks
- 🔀 **Auto-Merge** - Automatic merging to main branch after successful review
- 📊 **Quality Monitoring** - Real-time code quality metrics and reports
- ☁️ **Cloud Delegation** - Distributed task processing with cloud agents
- 👥 **Auto-Assignment System** - Intelligent responsibility assignment with load balancing and SLA monitoring

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
2. **Analyzes code** for potential issues like imports and formatting
3. **Auto-merges** approved PRs to the main branch

For detailed information, see [Auto Review & Merge Documentation](docs/AUTO_REVIEW_MERGE.md).

### Quick Start

The workflow runs automatically on:
- PR creation
- PR updates
- PR ready for review

No additional setup required! 🎉

## 👥 Auto-Assignment System

The Auto-Assignment System provides intelligent problem assignment and responsibility management:

1. **Intelligent Assignment** - Automatically analyzes problems and assigns to the most suitable team member
2. **Load Balancing** - Distributes work evenly across team members based on current workload
3. **SLA Monitoring** - Tracks response and resolution times with automatic escalation
4. **Performance Reporting** - Provides comprehensive analytics on team performance

For detailed information, see:
- [Auto-Assignment System Documentation](docs/AUTO_ASSIGNMENT_SYSTEM.md)
- [Auto-Assignment API Documentation](docs/AUTO_ASSIGNMENT_API.md)

### Quick Example

```bash
# Create an assignment
curl -X POST http://localhost:3000/api/v1/assignment/assign \
  -H "Content-Type: application/json" \
  -d '{
    "type": "BACKEND_API",
    "priority": "HIGH",
    "description": "API endpoint error"
  }'
```

## 📚 Documentation
