# CI 互動式客服升級指南

## 🎯 概述

本指南說明如何將任何現有的 CI workflow 升級為具有**動態互動式客服能力**的智能系統。每個 CI 都將成為一個獨立的、靈活的互動式客服代理，能夠：

- 🤖 自動診斷問題
- 💬 提供互動式反饋
- 🏷️ 智能標籤管理
- 📊 生成詳細報告
- 🗣️ 響應開發者命令

## 🏗️ 系統架構

```
┌────────────────────────────────────────────────────────┐
│              每個 CI Workflow                           │
│  (Core Services CI, Integration, Deploy, etc.)        │
├────────────────────────────────────────────────────────┤
│                                                         │
│  原有 CI Jobs                                           │
│  ├─ 構建                                                │
│  ├─ 測試                                                │
│  ├─ 驗證                                                │
│  └─ 狀態報告                                            │
│         ↓                                               │
│  [新增] 互動式客服 Job                                  │
│  ├─ 調用 interactive-ci-service.yml                     │
│  ├─ 傳遞執行狀態和上下文                                │
│  └─ 獲得智能反饋                                        │
│         ↓                                               │
└────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────┐
│     interactive-ci-service.yml (可重用服務)             │
├────────────────────────────────────────────────────────┤
│  🔍 分析 CI 狀態                                        │
│  🤖 智能診斷錯誤                                        │
│  💬 生成互動式評論                                      │
│  🏷️ 管理 PR 標籤                                       │
│  📊 創建服務摘要                                        │
└────────────────────────────────────────────────────────┘
         ↓
┌────────────────────────────────────────────────────────┐
│              PR 評論 & 互動                             │
│  • 每個 CI 有獨立的客服評論                             │
│  • 開發者可用 @copilot 命令互動                         │
│  • 智能標籤自動管理                                     │
└────────────────────────────────────────────────────────┘
```

## 📋 快速開始

### 步驟 1：在現有 CI 末尾添加互動式客服 Job

在任何 CI workflow 的 `jobs:` 部分末尾添加：

```yaml
  # ==================== 互動式客服整合 ====================
  interactive-service:
    name: 🤖 [CI名稱] 互動式客服
    needs: [job1, job2, job3]  # 列出所有需要等待的 jobs
    if: always()  # 確保無論成功或失敗都執行
    uses: ./.github/workflows/interactive-ci-service.yml
    with:
      ci-name: "[CI名稱]"  # 例如："Core Services CI"
      ci-status: ${{ (needs.job1.result == 'success' && needs.job2.result == 'success') && 'success' || 'failure' }}
      ci-context: |
        {
          "job1": "${{ needs.job1.result }}",
          "job2": "${{ needs.job2.result }}"
        }
      error-logs: ${{ needs.job1.result == 'failure' && '檢測到失敗' || '' }}
    permissions:
      contents: read
      pull-requests: write
      issues: write
```

### 步驟 2：確保 Workflow 有正確的權限

在 workflow 頂層添加或更新 `permissions:`：

```yaml
permissions:
  contents: read
  security-events: write  # 如原有
  pull-requests: write    # 互動式客服需要
  issues: write          # 互動式客服需要
```

### 步驟 3：測試

提交 PR 後，CI 執行完畢會自動：
1. 生成互動式客服評論
2. 添加相應標籤
3. 提供互動命令

## 🎨 完整範例

### 範例 1：Core Services CI（已升級）

```yaml
---
name: Core Services CI

on:
  pull_request:
    paths:
      - 'core/contracts/**'
      - 'mcp-servers/**'

permissions:
  contents: read
  security-events: write
  pull-requests: write
  issues: write

jobs:
  # 原有的 CI jobs
  contracts-l1-ci:
    name: 🏗️ Contracts L1 CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
      # ... 其他步驟
  
  mcp-servers-ci:
    name: 🔧 MCP Servers CI
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run tests
        run: npm test
      # ... 其他步驟
  
  ci-status-report:
    needs: [contracts-l1-ci, mcp-servers-ci]
    runs-on: ubuntu-latest
    if: always()
    steps:
      - name: Generate report
        run: echo "CI completed"
  
  # ==================== 新增：互動式客服 ====================
  interactive-service:
    name: 🤖 Core Services 互動式客服
    needs: [contracts-l1-ci, mcp-servers-ci, ci-status-report]
    if: always()
    uses: ./.github/workflows/interactive-ci-service.yml
    with:
      ci-name: "Core Services CI"
      ci-status: ${{ (needs.contracts-l1-ci.result == 'success' && needs.mcp-servers-ci.result == 'success') && 'success' || 'failure' }}
      ci-context: |
        {
          "contracts_l1": "${{ needs.contracts-l1-ci.result }}",
          "mcp_servers": "${{ needs.mcp-servers-ci.result }}"
        }
      error-logs: ${{ needs.ci-status-report.result == 'failure' && '檢測到 CI 失敗' || '' }}
    permissions:
      contents: read
      pull-requests: write
      issues: write
```

### 範例 2：Integration & Deployment（升級模板）

```yaml
---
name: Integration & Deployment

on:
  push:
    branches: [main, develop]
  pull_request:

permissions:
  contents: read
  deployments: write
  pull-requests: write
  issues: write

jobs:
  integration-tests:
    name: 🧪 Integration Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run integration tests
        run: npm run test:integration
  
  deploy:
    name: 🚀 Deploy
    needs: integration-tests
    if: github.event_name == 'push'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to staging
        run: echo "Deploying..."
  
  # ==================== 互動式客服 ====================
  interactive-service:
    name: 🤖 Integration & Deployment 互動式客服
    needs: [integration-tests, deploy]
    if: always()
    uses: ./.github/workflows/interactive-ci-service.yml
    with:
      ci-name: "Integration & Deployment"
      ci-status: ${{ (needs.integration-tests.result == 'success' && (needs.deploy.result == 'success' || needs.deploy.result == 'skipped')) && 'success' || 'failure' }}
      ci-context: |
        {
          "integration_tests": "${{ needs.integration-tests.result }}",
          "deploy": "${{ needs.deploy.result }}"
        }
    permissions:
      contents: read
      pull-requests: write
      issues: write
```

### 範例 3：簡單的 Linter CI（升級模板）

```yaml
---
name: Code Quality Check

on:
  pull_request:

permissions:
  contents: read
  pull-requests: write
  issues: write

jobs:
  lint:
    name: 🎨 Lint Code
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run linter
        run: npm run lint
  
  # ==================== 互動式客服 ====================
  interactive-service:
    name: 🤖 Code Quality 互動式客服
    needs: [lint]
    if: always()
    uses: ./.github/workflows/interactive-ci-service.yml
    with:
      ci-name: "Code Quality Check"
      ci-status: ${{ needs.lint.result }}
      error-logs: ${{ needs.lint.result == 'failure' && '代碼格式檢查失敗，請運行 npm run lint:fix' || '' }}
    permissions:
      contents: read
      pull-requests: write
      issues: write
```

## 🤖 互動式客服功能

### 自動生成的評論格式

#### 成功時：

```markdown
## ✅ Core Services CI - 客服報告

🟢 **狀態**：執行成功

### 📋 服務摘要
- ✓ 所有檢查項目已完成
- ✓ 品質標準符合要求
- ✓ 準備進行下一階段

### 🤝 互動服務
如需協助，可使用以下命令：
- `@copilot help Core Services CI` - 獲取此 CI 的詳細說明
- `@copilot analyze Core Services CI` - 深度分析執行結果
- `@copilot report Core Services CI` - 生成詳細報告

---
*此評論由 Core Services CI 互動式客服自動生成*
```

#### 失敗時：

```markdown
## ❌ Core Services CI - 客服報告

🔴 **狀態**：執行失敗

### 🔍 問題診斷
**錯誤類型**：Node.js/npm 相關問題

### 💡 修復建議
1. 檢查 package.json 依賴版本
2. 清理 node_modules：`rm -rf node_modules && npm install`
3. 檢查 Node.js 版本是否 >= 18

### ⚡ 快速修復命令
**重新安裝依賴**
```bash
npm install
```

**修復安全問題**
```bash
npm audit fix
```

### 📊 錯誤摘要
```
[錯誤日誌摘要]
```

### 🤝 互動式客服
需要更多協助？使用以下命令：
- `@copilot analyze Core Services CI` - 深度分析此錯誤
- `@copilot fix Core Services CI` - 獲取自動修復建議
- `@copilot help Core Services CI` - 查看此 CI 的完整文檔
- `@copilot similar Core Services CI` - 查找相似問題的解決方案

### 📚 相關資源
- [CI 故障排除文檔](./docs/ci-troubleshooting.md)
- [Core Services CI 特定文檔](./docs/)
- [環境檢查工具](./scripts/check-env.sh)

---
*此評論由 Core Services CI 互動式客服自動生成*
```

### 支援的互動命令

每個 CI 的互動式客服支援以下命令：

| 命令 | 功能 |
|------|------|
| `@copilot help [CI名稱]` | 獲取該 CI 的詳細說明和文檔 |
| `@copilot analyze [CI名稱]` | 深度分析該 CI 的執行結果或錯誤 |
| `@copilot fix [CI名稱]` | 獲取自動修復建議和具體命令 |
| `@copilot report [CI名稱]` | 生成該 CI 的詳細執行報告 |
| `@copilot similar [CI名稱]` | 查找相似問題的解決方案 |

### 智能標籤管理

每個 CI 會自動管理以下標籤：

- `ci-[workflow-name]-failed`：該 CI 失敗時添加
- `ci-needs-attention`：任何 CI 失敗時添加
- 成功時自動移除相應標籤

## 🔄 批量升級現有 CI

### 需要升級的 CI 列表

根據專案現狀，以下 CI workflows 建議升級：

- [ ] `core-services-ci.yml` ✅ 已升級
- [ ] `integration-deployment.yml`
- [ ] `auto-vulnerability-fix.yml`
- [ ] `autofix-bot.yml`
- [ ] `compliance-report.yml`
- [ ] `deploy-contracts-l1.yml`
- [ ] `phase1-integration.yml`
- [ ] `stage-1-basic-ci.yml`
- [ ] `language-check.yml`
- [ ] `codeql-advanced.yml`

### 升級檢查清單

對每個 CI 執行以下步驟：

1. **添加互動式客服 job**
   ```yaml
   interactive-service:
     name: 🤖 [CI名稱] 互動式客服
     needs: [existing-jobs]
     if: always()
     uses: ./.github/workflows/interactive-ci-service.yml
     with:
       ci-name: "[CI名稱]"
       ci-status: ${{ ... }}
   ```

2. **更新權限**
   ```yaml
   permissions:
     contents: read
     pull-requests: write
     issues: write
   ```

3. **測試**
   - 創建測試 PR
   - 驗證評論生成
   - 驗證標籤管理
   - 測試互動命令

4. **文檔**
   - 更新 CI 特定文檔
   - 添加互動命令示例

## 🎯 最佳實踐

### 1. CI 名稱命名規範

使用清晰、描述性的名稱：

✅ 好的名稱：
- "Core Services CI"
- "Integration & Deployment"
- "Code Quality Check"
- "Security Scan"

❌ 避免的名稱：
- "CI"
- "Test"
- "Build"
- "Check"

### 2. 錯誤日誌傳遞

盡可能傳遞具體的錯誤信息：

```yaml
error-logs: |
  ${{ needs.test-job.result == 'failure' && 
      format('測試失敗：{0}', needs.test-job.outputs.error) || 
      '' }}
```

### 3. 上下文信息

提供完整的執行上下文：

```yaml
ci-context: |
  {
    "job1": "${{ needs.job1.result }}",
    "job2": "${{ needs.job2.result }}",
    "trigger": "${{ github.event_name }}",
    "branch": "${{ github.ref_name }}"
  }
```

### 4. 條件執行

確保互動式客服在所有情況下都執行：

```yaml
if: always()  # 不要使用 success() 或 failure()
```

## 📊 監控和維護

### 查看所有互動式客服狀態

在 PR 中，每個 CI 都會有獨立的客服評論。可以通過標籤快速過濾：

```bash
# 查找有 CI 問題的 PRs
gh pr list --label "ci-needs-attention"

# 查找特定 CI 失敗的 PRs
gh pr list --label "ci-core-services-ci-failed"
```

### 性能指標

每個互動式客服的性能特徵：

- **執行時間**：30-60 秒
- **資源消耗**：極低（僅 API 調用）
- **評論數量**：每個 CI 一條（自動更新）

## 🔮 未來增強

計劃中的功能：

- [ ] AI 輔助深度分析
- [ ] 自動修復 PR 建議
- [ ] 跨 CI 依賴分析
- [ ] 歷史趨勢報告
- [ ] Slack/Teams 集成

## 📚 相關文檔

- [動態 CI 助手文檔](./DYNAMIC_CI_ASSISTANT.md)
- [CI 故障排除 Runbook](./ci-troubleshooting.md)
- [CI 系統架構](./CI_AUTO_COMMENT_SYSTEM.md)

## 🆘 疑難排解

### 問題：互動式客服沒有生成評論

**可能原因**：
1. 權限不足
2. PR 編號無法獲取
3. Workflow 語法錯誤

**解決方案**：
1. 確保 `permissions` 包含 `pull-requests: write` 和 `issues: write`
2. 檢查 workflow run 日誌
3. 驗證 YAML 語法

### 問題：評論重複出現

**可能原因**：
找不到現有評論進行更新

**解決方案**：
確保 `ci-name` 在每次執行時保持一致

### 問題：標籤沒有正確管理

**可能原因**：
標籤名稱格式問題

**解決方案**：
檢查標籤是否已在 repository 中創建

## 📝 版本歷史

### v1.0.0 (2024-11-26)
- ✨ 初始版本發布
- 🤖 可重用互動式客服系統
- 💬 智能評論生成
- 🏷️ 自動標籤管理
- 📊 服務摘要報告

## 📄 授權

MIT License - 詳見專案根目錄的 LICENSE 檔案
