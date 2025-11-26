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
- 🆘 **Advanced Escalation System** - **NEW** Multi-level intelligent escalation with customer service integration
  - **Smart Escalation** - 5-level escalation hierarchy (L1 Auto → L5 Customer Service)
  - **Customer Service Integration** - Intelligent agent assignment based on expertise and workload
  - **Safety-Critical Priority** - Direct escalation for drone and autonomous vehicle safety issues
  - **Complete Lifecycle** - Full tracking from creation to resolution with detailed statistics
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

## 🆘 Advanced Escalation System

The Advanced Escalation System handles intelligent escalation when automated solutions fail, especially for safety-critical drone and autonomous vehicle scenarios:

1. **Multi-level Escalation** - 5-tier hierarchy from auto-fix to customer service
2. **Smart Agent Assignment** - Intelligent selection based on expertise, workload, and performance
3. **Safety-Critical Priority** - Immediate escalation for safety-related issues
4. **Complete Lifecycle** - Full tracking with detailed resolution records and statistics

**Escalation Levels:**
- **L1: Auto** - Automated processing and fixes
- **L2: Team Lead** - Team coordination and resource allocation
- **L3: Support Engineer** - Technical troubleshooting and investigation
- **L4: Senior Engineer** - Complex architectural and critical system issues
- **L5: Customer Service** - Safety-critical, high-impact customer issues

For detailed information, see:
- [Advanced Escalation System Documentation](docs/ADVANCED_ESCALATION_SYSTEM.md)
- [Advanced Features Summary](docs/ADVANCED_FEATURES_SUMMARY.md)

### Quick Example

```bash
# Create an escalation for auto-fix failure
curl -X POST http://localhost:3000/api/v1/escalation/create \
  -H "Content-Type: application/json" \
  -d '{
    "incidentId": "incident-001",
    "trigger": "AUTO_FIX_FAILED",
    "priority": "CRITICAL",
    "context": {
      "systemType": "DRONE",
      "environment": "PRODUCTION",
      "errorDetails": {
        "message": "Flight controller auto-fix failed after 3 attempts",
        "affectedComponents": ["flight-controller"],
        "impactLevel": "HIGH"
      },
      "autoFixAttempts": []
    }
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

## 🤖 動態互動 CI 系統

我們實現了**全新的動態互動 CI 系統**，讓每個 CI workflow 都成為一個靈活的互動式客服代理。

### 🎯 系統特色

#### 1. 每個 CI 都是獨立的互動式客服
- 🤖 **智能代理**：每個 CI（Core Services CI、Integration & Deployment 等）都有自己的互動式客服
- 💬 **獨立評論**：每個 CI 在 PR 中有獨立的評論和狀態報告
- 🎯 **針對性診斷**：根據 CI 類型提供專門的錯誤分析和修復建議
- 🏷️ **精準標籤**：每個 CI 管理自己的失敗標籤

#### 2. 統一的監控和互動
- 🔍 **全局監控**：動態 CI 助手監控所有 CI 的整體狀態
- 🗣️ **開發者互動**：支援 `@copilot` 命令獲取幫助
- 📊 **統一報告**：跨 CI 的整體健康度報告
- ♻️ **零資源浪費**：不重複運行測試，只提供智能分析

### 使用方式

#### 當 CI 失敗時

1. **查看各 CI 的獨立客服評論**
   - 每個 CI（如 Core Services CI）都有自己的診斷報告
   - 報告包含該 CI 特定的錯誤分析和修復建議
   - 查看全局監控助手的整體分析

2. **執行 CI 特定的快速修復命令**
   每個 CI 的評論會提供針對性的修復命令，例如：
   ```bash
   # Core Services CI 相關
   npm test
   npm run lint:fix
   
   # Docker 相關 CI
   docker-compose build --no-cache
   docker system prune -a
   
   # 環境檢查
   bash scripts/check-env.sh
   ```

3. **與 CI 客服互動獲取幫助**
   在 PR 評論中針對特定 CI 輸入命令：
   - `@copilot analyze Core Services CI` - 深度分析該 CI
   - `@copilot fix Core Services CI` - 獲取自動修復建議
   - `@copilot help Integration & Deployment` - 查看該 CI 文檔
   - `@copilot similar Code Quality Check` - 查找相似問題

### 系統架構

```
每個 CI Workflow              全局監控
─────────────────              ─────────
Core Services CI    ────┐
  └─ 互動式客服           │
                         │
Integration CI      ────┤     動態 CI 助手
  └─ 互動式客服           ├───→ • 整體狀態監控
                         │     • 跨 CI 分析
Deploy CI           ────┤     • 全局互動
  └─ 互動式客服           │
                         │
Code Quality CI     ────┘
  └─ 互動式客服
```

### 系統優勢

| 特性 | 傳統 CI | 新系統 |
|------|--------|--------|
| **CI 獨立性** | 每個 CI 獨立運行 | 每個 CI 都有自己的互動式客服 |
| **反饋速度** | 失敗後需查日誌 | 30-60 秒內獲得智能診斷 |
| **診斷質量** | 基礎日誌 | AI 針對性分析 + 修復建議 |
| **互動性** | 無 | 每個 CI 支援獨立對話 |
| **資源消耗** | 正常 CI 執行 | 額外客服僅 30-60 秒 |
| **標籤管理** | 手動 | 每個 CI 自動管理標籤 |

### 相關文檔

- 🆕 **[CI 互動式客服升級指南](./docs/INTERACTIVE_CI_UPGRADE_GUIDE.md)** - 如何升級任何 CI
- 📖 [動態 CI 助手完整文檔](./docs/DYNAMIC_CI_ASSISTANT.md) - 全局監控系統
- 🔧 [CI 故障排除 Runbook](./docs/ci-troubleshooting.md) - 常見問題解決
- 🛠️ [CI 系統架構](./docs/CI_AUTO_COMMENT_SYSTEM.md) - 系統設計文檔
- 📜 [環境檢查腳本](./scripts/check-env.sh) - 本地環境診斷

### 快速參考

**常見 CI 問題快速修復**

| 問題類型 | 診斷方法 | 快速修復 |
|---------|---------|---------|
| 環境問題 | 動態 CI 助手自動診斷 | `bash scripts/check-env.sh` |
| Docker 構建失敗 | 查看 PR 評論中的分析 | `docker-compose build --no-cache` |
| 測試失敗 | 查看失敗的具體測試 | `npm test -- --verbose` |
| 磁盤空間不足 | 檢查磁盤使用率 | `docker system prune -a` |
| 部署失敗 | 檢查環境變數和權限 | 查看部署日誌 |

**互動命令**

```bash
# 針對特定 CI 的命令：
@copilot analyze Core Services CI     # 深度分析該 CI
@copilot fix Core Services CI         # 獲取自動修復建議
@copilot help Integration CI          # 查看該 CI 文檔
@copilot similar Deploy CI            # 查找相似問題

# 全局命令：
@copilot 幫我分析                     # 分析所有 CI 狀態
@copilot 環境檢查                     # 環境診斷指南
@copilot 文檔                         # 查看系統文檔
```

