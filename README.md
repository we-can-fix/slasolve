# SLASolve

A modern platform for managing Service Level Agreements with automated code review and merge capabilities.

## 🌟 Features

- 🤖 **Auto-Fix Bot** - Intelligent code analysis and automatic fixing
- 🧠 **Intelligent Automation** - Multi-agent AI system for autonomous code analysis (extracted from OJ-agent)
  - **TaskExecutor** - Real-time code analysis with safety-critical validation
  - **RecognitionServer** - Intent detection and intelligent routing
  - **VisualizationAgent** - Intuitive explanations with domain-specific analogies
- 🔍 **Automatic Code Review** - Automated PR review with comprehensive checks
- 🔀 **Auto-Merge** - Automatic merging to main branch after successful review
- 📊 **Quality Monitoring** - Real-time code quality metrics and reports
- ☁️ **Cloud Delegation** - Distributed task processing with cloud agents
- 👥 **Auto-Assignment System** - Intelligent responsibility assignment with load balancing and SLA monitoring
- 🚁 **Autonomous Systems Support** - Specialized for drones, self-driving vehicles, and automated iteration
- 🏗️ **Five-Skeleton Autonomous Framework** - Complete autonomous drone/self-driving system framework

## 📁 Structure

- `autonomous-system/` - **NEW** Five-skeleton autonomous drone/self-driving system framework
  - `architecture-stability/` - C++ core control layer with ROS 2
  - `api-governance/` - Python module governance and API contract validation
  - `testing-compatibility/` - Python + YAML automated testing framework
  - `security-observability/` - Go microservice for distributed tracing and security monitoring
  - `docs-examples/` - Complete documentation and governance definitions
- `intelligent-automation/` - Multi-agent AI system for autonomous code analysis
  - `agents/` - Specialized AI agents (TaskExecutor, RecognitionServer, VisualizationAgent)
  - `pipeline_service.py` - Orchestration service for multi-agent coordination
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

### Autonomous System Quick Start

The autonomous system framework provides complete support for drone and self-driving vehicle development:

```bash
# Navigate to autonomous system
cd autonomous-system

# See detailed quickstart guide
cat docs-examples/QUICKSTART.md

# Install dependencies (Ubuntu 20.04+, Python 3.8+, ROS 2, Go 1.20+)
# Refer to the detailed guide for complete installation steps
```

See [Autonomous System Documentation](autonomous-system/README.md) for complete setup instructions.

### Intelligent Automation Quick Start

```bash
# Install Python dependencies for intelligent automation
cd intelligent-automation
pip install -r requirements.txt

# Run example
python pipeline_service.py
```

See individual service README files for specific setup instructions, including [Intelligent Automation Module](intelligent-automation/README.md).

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

## 🏗️ Autonomous System Framework

The autonomous system framework provides a complete five-skeleton architecture for drone and self-driving vehicle development:

### Five-Skeleton Architecture

1. **架構穩定性骨架 (Architecture Stability)** - C++ + ROS 2
   - Real-time flight control (100Hz control loop)
   - IMU sensor fusion
   - PID controller implementation

2. **API 規格與治理邊界骨架 (API Governance)** - Python
   - Module responsibility matrix
   - API contract validation
   - Dependency chain verification

3. **測試與兼容性骨架 (Testing & Compatibility)** - Python + YAML
   - Automated test suites
   - Cross-version compatibility testing
   - Test report generation

4. **安全性與觀測骨架 (Security & Observability)** - Go
   - Distributed event logging
   - Safety monitoring and violation detection
   - Trace ID for distributed tracing

5. **文件與範例骨架 (Documentation & Examples)** - YAML + Markdown
   - Governance matrix definitions
   - Complete API documentation
   - Quickstart guides

### Quick Example

```bash
# Run API governance validation
cd autonomous-system/api-governance
python3 api_contract.py

# Run compatibility tests
cd ../testing-compatibility
python3 test_compatibility.py

# Build and run flight controller (requires ROS 2)
cd ../architecture-stability
colcon build --symlink-install
ros2 run autonomy_core flight_controller
```

For complete documentation, see:
- [Autonomous System Documentation](autonomous-system/README.md)
- [Quickstart Guide](autonomous-system/docs-examples/QUICKSTART.md)
- [API Documentation](autonomous-system/docs-examples/API_DOCUMENTATION.md)
- [Governance Matrix](autonomous-system/docs-examples/governance_matrix.yaml)

## 🔧 CI 故障排除

若 CI 失敗，請遵循以下步驟：

### 快速診斷

1. **查看 PR 自動評論**
   - CI 系統會自動在 PR 中留言，說明錯誤原因與修正步驟
   - 評論包含具體的命令和解決方案

2. **運行環境檢查**
   ```bash
   bash scripts/check-env.sh
   ```
   此腳本會檢查：
   - Docker 安裝
   - Docker Compose 安裝
   - Node.js 版本（需要 >= 18）
   - Git 安裝
   - 磁盤空間

3. **參考故障排除文檔**
   詳細的錯誤解決方案請參考 [CI 故障排除 Runbook](./docs/ci-troubleshooting.md)

### 常見問題

| 問題 | 快速解決 |
|------|---------|
| Docker Compose 未安裝 | `curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose && sudo chmod +x /usr/local/bin/docker-compose` |
| 磁盤空間不足 | `docker system prune -a` |
| 測試失敗 | `npm install --workspaces && npm test` |

### CI Workflow 結構

CI 自動評論系統包含：
- **環境檢查階段**：驗證 Docker、Docker Compose、Node.js
- **構建與測試階段**：構建鏡像、運行測試
- **自動評論階段**：生成 PR 評論、添加標籤

### 相關資源

- [CI 自動評論 Workflow](../.github/workflows/ci-auto-comment.yml)
- [環境檢查腳本](./scripts/check-env.sh)
- [CI 故障排除完整指南](./docs/ci-troubleshooting.md)

