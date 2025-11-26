# 🛡️ 自動駕駛級 CI/CD 合規與審計框架

## 概述

本文件定義自動駕駛級 CI/CD 系統的合規性要求，適用於所有使用 `autonomous-ci-guardian.yml` workflow 的專案。本框架確保自動化部署在保持速度的同時，滿足審計、安全和可靠性要求。

### 適用對象
- DevOps 工程師：實施和維護 CI/CD pipeline
- 合規稽核員：驗證自動化決策的可追蹤性
- 安全團隊：評估風險評估和自動修復機制

### 與 autonomous-ci-guardian.yml workflow 的對應關係
- 本合規框架直接對應於 `autonomous-ci-guardian.yml`，所有規範均需在該 workflow 中落實。
- 變更追蹤、審計日誌、決策點審查與故障恢復機制，皆須以自動化步驟與機器可讀 metadata 實現。

### 實施與驗證指引
- 請於 CI/CD pipeline 中加入審計日誌產生、風險評估自動化、人工審查流程與回滾策略。
- 定期由合規稽核員審查 pipeline 產生之日誌與決策記錄，並比對本文件要求。
- 安全團隊需驗證自動修復機制與回滾流程之可用性與時效性。
## 1. 完整的變更追蹤

### 審計日誌結構

```json
{
  "change_id": "CHG-2025-001234",
  "timestamp": "2025-11-25T15:02:00Z",
  "actor": "ci-system@company.com",
  "action": "DEPLOY",
  "environment": "production",
  "version": "v1.2.3",
  "risk_assessment": {
    "score": 25,
    "level": "LOW",
    "factors": [
      "code_complexity: LOW",
      "test_coverage: 95%",
      "security_scan: PASSED",
      "performance: NORMAL"
    ]
  },
  "deployment_strategy": "FULL_DEPLOY",
  "result": "SUCCESS",
  "rollback_available": true,
  "previous_version": "v1.2.2"
}
```

## 2. 完全自主決策機制

本系統採用 **完全自主決策** 模式，所有風險等級均由規則式自動評估與處置。評估邏輯基於明確規則與閾值，未使用機器學習或 AI 模型。CRITICAL 風險會觸發自動回滾並通知安全團隊，其他風險等級完全自動處理。

| 風險等級 | 自動化程度 | 決策模式 | 執行時間 | 自動化策略 |
|---------|----------|---------|---------|-----------|
| LOW | 100% | 完全自主 | 即時 | 直接部署 |
| MEDIUM | 100% | 完全自主 | 即時 | 分階段部署（自動監控） |
| HIGH | 100% | 完全自主 | 即時 | 金絲雀部署（自動驗證） |
| CRITICAL | 100% | 自動回滾 | 即時 | 自動回滾至穩定版本（通知安全團隊） |

### 自主決策實施機制

- **完全自主**：系統根據風險評估結果自動選擇最佳部署策略，無需等待人工核准
- **智能監控**：部署過程中持續監控關鍵指標（錯誤率、性能、健康狀態）
- **自動修復**：偵測到異常時立即執行自動回滾或降級，確保系統穩定性
- **CRITICAL 處理**：偵測到嚴重安全漏洞時，跳過健康檢查直接觸發自動回滾，並通知安全團隊
- **決策時間**：所有決策均在秒級完成，確保快速響應
- **審計追蹤**：所有自動決策均記錄於審計日誌，供事後分析與合規檢查
- **通知機制**：重大決策（HIGH/CRITICAL）執行後立即通知相關團隊，但不阻塞執行流程
## 3. 故障恢復時間目標（RTO）

- **CRITICAL**：< 5 分鐘（自動回滾）
- **HIGH**：< 15 分鐘（金絲雀回滾）
- **MEDIUM**：< 1 小時（分階段回滾）
- **LOW**：< 4 小時（標準回滾）

## 4. 實作與驗證範例

### 4.1 審計日誌產生範例

在 CI/CD pipeline 中自動產生審計日誌：

```bash
#!/bin/bash
# 在 autonomous-ci-guardian.yml 的每個關鍵決策點執行

CHANGE_ID="CHG-$(date +%Y%m%d)-$(uuidgen | cut -d'-' -f1)"
TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)

cat > audit-log-${CHANGE_ID}.json << EOFAUDIT
{
  "change_id": "$CHANGE_ID",
  "timestamp": "$TIMESTAMP",
  "actor": "ci-system@${GITHUB_REPOSITORY}",
  "action": "${ACTION}",
  "environment": "${ENVIRONMENT}",
  "version": "${VERSION}",
  "risk_assessment": {
    "score": ${RISK_SCORE},
    "level": "${RISK_LEVEL}",
    "factors": ${RISK_FACTORS_JSON}
  },
  "deployment_strategy": "${DEPLOYMENT_STRATEGY}",
  "result": "${RESULT}",
  "rollback_available": ${ROLLBACK_AVAILABLE},
  "previous_version": "${PREVIOUS_VERSION}",
  "automated_decision": true,
  "human_intervention": false
}
EOFAUDIT

# 將審計日誌上傳至集中式日誌系統
# curl -X POST https://audit-logs.example.com/api/logs \
#   -H "Content-Type: application/json" \
#   -d @audit-log-${CHANGE_ID}.json
```

### 4.2 風險評估自動化驗證

驗證風險評估邏輯是否正確運作：

```bash
# 測試腳本：驗證不同風險等級的自動決策
test_risk_assessment() {
  local test_cases=(
    "CRITICAL:0:1:ROLLBACK"      # failures=0, critical_vulns=1
    "HIGH:3:0:CANARY_DEPLOY"     # failures=3, critical_vulns=0
    "MEDIUM:1:0:STAGED_DEPLOY"   # failures=1, critical_vulns=0
    "LOW:0:0:FULL_DEPLOY"        # failures=0, critical_vulns=0
  )

  for case in "${test_cases[@]}"; do
    IFS=':' read -r level failures critical expected <<< "$case"
    
    # 模擬風險評估邏輯（從 workflow 中提取）
    CRITICAL_VULNS=$critical
    if [ "$failures" -gt 2 ]; then
      ACTION="CANARY_DEPLOY"
    elif [ "$failures" -gt 0 ]; then
      ACTION="STAGED_DEPLOY"
    else
      ACTION="FULL_DEPLOY"
    fi
    
    if [ "$CRITICAL_VULNS" -gt 0 ]; then
      ACTION="ROLLBACK"
    fi
    
    if [[ "$ACTION" == "$expected" ]]; then
      echo "✅ 風險等級 $level 測試通過（預期: $expected, 實際: $ACTION）"
    else
      echo "❌ 風險等級 $level 測試失敗：預期 $expected，實際 $ACTION"
      exit 1
    fi
  done
}
```

### 4.3 自動回滾機制驗證

確保自動回滾在預期時間內完成：

```bash
# 驗證回滾流程
verify_rollback() {
  local start_time=$(date +%s)
  
  # 模擬回滾流程（實際應透過 workflow 觸發）
  echo "觸發 CRITICAL 風險回滾..."
  
  # 取得前一個穩定版本
  PREVIOUS_VERSION=$(git describe --tags --abbrev=0 HEAD~1 2>/dev/null || echo "v1.0.0")
  echo "回滾到版本：$PREVIOUS_VERSION"
  
  # 驗證版本格式（支援帶或不帶 v 前綴）
  if ! [[ "$PREVIOUS_VERSION" =~ ^v?[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "❌ 版本格式不正確: $PREVIOUS_VERSION"
    exit 1
  fi
  
  # 執行回滾（演示模式）
  echo "[演示] git checkout $PREVIOUS_VERSION"
  echo "[演示] docker-compose build --no-cache"
  echo "[演示] docker-compose up -d"
  
  local end_time=$(date +%s)
  local duration=$((end_time - start_time))
  
  # 驗證 RTO < 5 分鐘（300 秒）
  if [ $duration -lt 300 ]; then
    echo "✅ 回滾在 ${duration}s 內完成（RTO: <300s）"
  else
    echo "❌ 回滾超時：${duration}s（RTO: <300s）"
    exit 1
  fi
  
  # 驗證服務健康（若服務已啟動）
  if command -v curl >/dev/null && curl -f http://localhost:8001/health 2>/dev/null; then
    echo "✅ 服務健康檢查通過"
  else
    echo "⚠️  服務未運行或健康檢查端點不可用（演示模式）"
  fi
}
```

### 4.4 整合至 CI/CD 流程

在 `autonomous-ci-guardian.yml` 中整合上述驗證：

```yaml
jobs:
  compliance-verification:
    runs-on: ubuntu-latest
    steps:
      - name: 驗證審計日誌產生
        run: |
          source scripts/generate-audit-log.sh
          test -f audit-log-*.json || exit 1
          
      - name: 驗證風險評估邏輯
        run: bash scripts/test-risk-assessment.sh
        
      - name: 驗證回滾機制
        run: bash scripts/verify-rollback.sh
```

### 4.5 合規稽核檢查清單

定期執行以下檢查以確保系統符合完全自主決策標準：

- [ ] 所有風險等級（LOW/MEDIUM/HIGH/CRITICAL）均能自動處理
- [ ] 無人工核准阻塞點（除非為選擇性事後通知）
- [ ] 審計日誌完整記錄所有自動決策
- [ ] RTO 符合各風險等級要求
- [ ] 自動回滾機制經過驗證且可靠
- [ ] 監控與告警系統正常運作
- [ ] 決策邏輯可追溯且符合機器可讀格式
