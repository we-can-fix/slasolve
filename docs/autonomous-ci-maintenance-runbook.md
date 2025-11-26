# 🔧 自主 CI 監護系統 - 維護運行手冊

> **目標受眾**: DevOps 工程師、SRE、系統管理員  
> **維護級別**: L1-L3 支援  
> **最後更新**: 2025-11-26

---

## 📋 目錄

1. [快速參考](#快速參考)
2. [日常維護](#日常維護)
3. [故障處理](#故障處理)
4. [性能調優](#性能調優)
5. [安全維護](#安全維護)
6. [災難恢復](#災難恢復)
7. [監控和告警](#監控和告警)

---

## 快速參考

### 關鍵命令速查

```bash
# 檢查工作流程狀態
gh workflow view "🤖 Autonomous CI Guardian"

# 手動觸發工作流程
gh workflow run autonomous-ci-guardian.yml

# 查看最近運行
gh run list --workflow=autonomous-ci-guardian.yml --limit 10

# 查看特定運行的日誌
gh run view <run-id> --log

# 啟用維護模式
gh variable set MAINTENANCE_MODE --body "true"

# 禁用維護模式
gh variable set MAINTENANCE_MODE --body "false"

# 檢查服務健康
docker-compose ps
curl -f http://localhost:8001/health

# 查看系統資源
docker stats --no-stream
df -h
free -h
```

### 緊急聯繫方式

| 角色 | 聯繫方式 | 可用時間 |
|------|---------|---------|
| 首要待命 | Slack: #critical-alerts | 24/7 |
| 備份待命 | PagerDuty: autonomous-oncall | 24/7 |
| 工程領導 | Email: engineering-leadership@example.com | 緊急情況 |

> ⚠️ **注意**: 在生產環境部署前，請更新為實際的聯繫方式

---

## 日常維護

### 每日檢查（5-10 分鐘）

#### 1. 系統健康檢查

```bash
#!/bin/bash
# daily-health-check.sh

echo "=== 每日健康檢查 ==="
echo "時間: $(date)"
echo ""

# 檢查工作流程狀態
echo "1. 檢查 CI 工作流程狀態..."
gh run list --workflow=autonomous-ci-guardian.yml --limit 5 --json status,conclusion,createdAt

# 檢查服務狀態
echo ""
echo "2. 檢查 Docker 服務..."
docker-compose ps

# 檢查資源使用
echo ""
echo "3. 檢查資源使用..."
echo "CPU 和內存:"
free -h
echo ""
echo "磁盤空間:"
df -h | grep -E '^/dev/'

# 檢查最近錯誤
echo ""
echo "4. 檢查最近錯誤..."
docker-compose logs --tail=50 | grep -i error || echo "無錯誤"

# 檢查安全漏洞
echo ""
echo "5. 安全掃描摘要..."
npm audit --audit-level=high 2>/dev/null || echo "需要審查"

echo ""
echo "=== 檢查完成 ==="
```

**執行方式**:
```bash
chmod +x daily-health-check.sh
./daily-health-check.sh | tee daily-check-$(date +%Y%m%d).log
```

**預期結果**:
- ✅ 所有服務顯示為 "Up"
- ✅ 資源使用 < 80%
- ✅ 無嚴重錯誤
- ✅ 無高危漏洞

#### 2. 日誌審查

```bash
# 審查關鍵服務日誌
for service in flight-control gps-nav obstacle-detect telemetry; do
  echo "=== $service logs ==="
  docker-compose logs --tail=20 $service
  echo ""
done
```

#### 3. 備份驗證

```bash
# 驗證最近的備份
ls -lht artifacts/reports/ | head -5
ls -lht artifacts/metrics/ | head -5
ls -lht artifacts/diagnostics/ | head -5
```

### 每週任務（30-60 分鐘）

#### 1. 性能趨勢分析

```python
#!/usr/bin/env python3
# weekly-performance-analysis.py

import json
import glob
from datetime import datetime, timedelta
from collections import defaultdict

def analyze_weekly_metrics():
    """分析過去一週的性能指標"""
    metrics_files = glob.glob('artifacts/metrics/*.json')
    
    # 過濾最近7天的文件
    week_ago = datetime.now() - timedelta(days=7)
    recent_metrics = []
    
    for file in metrics_files:
        try:
            with open(file) as f:
                data = json.load(f)
                timestamp = datetime.fromisoformat(data.get('timestamp', '').replace('Z', '+00:00'))
                if timestamp > week_ago:
                    recent_metrics.append(data)
        except Exception as e:
            print(f"Error reading {file}: {e}")
    
    # 統計分析
    print(f"📊 週性能報告")
    print(f"分析時間範圍: {week_ago.date()} 至 {datetime.now().date()}")
    print(f"總指標記錄: {len(recent_metrics)}")
    print("")
    
    # 這裡添加更多分析邏輯
    # - 響應時間趨勢
    # - 錯誤率變化
    # - 資源使用峰值
    
    return recent_metrics

if __name__ == '__main__':
    analyze_weekly_metrics()
```

#### 2. 依賴更新檢查

```bash
# 檢查過時的依賴
npm outdated

# 檢查安全更新
npm audit

# 更新補丁版本（安全）
npm update

# 運行測試驗證
npm test
```

#### 3. 容量規劃評估

```bash
#!/bin/bash
# capacity-planning.sh

echo "=== 容量規劃評估 ==="

# 磁盤使用趨勢
echo "1. 磁盤使用情況:"
df -h | awk 'NR==1 || /^\/dev/ {print}'

# Docker 映像和容器清理
echo ""
echo "2. Docker 資源使用:"
docker system df

# 建議清理（如果超過 80%）
USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
if [[ "$USAGE" =~ ^[0-9]+$ ]] && [ "$USAGE" -gt 80 ]; then
  echo "⚠️  磁盤使用超過 80%，建議清理"
  echo "清理建議:"
  echo "  - docker system prune -a"
  echo "  - 清理舊日誌文件"
  echo "  - 歸檔舊報告"
elif [ -z "$USAGE" ]; then
  echo "⚠️  無法獲取磁盤使用率"
fi

# 內存趨勢
echo ""
echo "3. 內存使用趨勢:"
free -h
```

### 每月任務（2-4 小時）

#### 1. 完整系統健康審計

```bash
#!/bin/bash
# monthly-system-audit.sh

echo "=== 月度系統審計 ==="
echo "審計時間: $(date)"
echo ""

# 1. 工作流程執行統計
echo "1️⃣ 工作流程執行統計（過去30天）:"
gh run list --workflow=autonomous-ci-guardian.yml --limit 1000 --json status,conclusion,createdAt \
  | jq '[.[] | select((.createdAt | fromdateiso8601) > (now - 30*24*3600))] | 
         group_by(.conclusion) | 
         map({conclusion: .[0].conclusion, count: length})'

# 2. 失敗分析
echo ""
echo "2️⃣ 失敗原因分析:"
gh run list --workflow=autonomous-ci-guardian.yml --status failure --limit 50 \
  | awk '{print $NF}' | sort | uniq -c | sort -rn

# 3. 平均執行時間
echo ""
echo "3️⃣ 平均執行時間分析:"
# 這裡添加執行時間計算邏輯

# 4. 資源使用峰值
echo ""
echo "4️⃣ 資源使用峰值記錄:"
find artifacts/metrics/ -name "*.json" -mtime -30 -exec cat {} \; \
  | jq -s 'max_by(.cpu_usage)'

# 5. 安全事件
echo ""
echo "5️⃣ 安全事件摘要:"
find artifacts/security/ -name "*.json" -mtime -30 -exec cat {} \; \
  | jq -s '[.[] | select(.metadata.vulnerabilities.critical > 0)]'

# 6. 建議改進措施
echo ""
echo "6️⃣ 建議改進措施:"
echo "  - 審查失敗率 > 5% 的工作流程"
echo "  - 優化執行時間 > 30分鐘的任務"
echo "  - 處理所有嚴重安全漏洞"
echo "  - 更新過時依賴 (> 6個月)"

echo ""
echo "=== 審計完成 ==="
```

#### 2. 災難恢復測試

```bash
#!/bin/bash
# dr-test.sh

echo "=== 災難恢復測試 ==="

# 1. 備份當前狀態（加密）
echo "1. 備份當前狀態（加密）..."
# 備份檔案將壓縮並以 AES-256-CBC 加密，密碼請設定 PG_BACKUP_PASS 環境變數
if [ -z "${PG_BACKUP_PASS:-}" ]; then
  echo "錯誤：未設定 PG_BACKUP_PASS 環境變數" >&2
  exit 1
fi
docker-compose exec -T db pg_dump -U postgres | gzip | openssl enc -aes-256-cbc -salt -pbkdf2 -pass env:PG_BACKUP_PASS > backup-$(date +%Y%m%d).sql.gz.enc
git tag dr-test-$(date +%Y%m%d)

# 2. 模擬故障
echo "2. 模擬服務故障..."
docker-compose stop flight-control

# 3. 測試自動恢復
echo "3. 測試自動恢復機制..."
sleep 30
# 系統應該自動重啟服務

# 4. 驗證恢復
echo "4. 驗證服務恢復..."
curl -f http://localhost:8001/health && echo "✅ 恢復成功" || echo "❌ 恢復失敗"

# 5. 測試完整回滾
echo "5. 測試回滾程序..."
PREVIOUS_TAG=$(git tag | grep -v dr-test | tail -1)
git checkout $PREVIOUS_TAG
docker-compose build
docker-compose up -d

# 6. 驗證回滾成功
echo "6. 驗證回滾..."
sleep 10
curl -f http://localhost:8001/health && echo "✅ 回滾成功" || echo "❌ 回滾失敗"

# 7. 恢復到最新狀態
echo "7. 恢復到最新狀態..."
git checkout main
docker-compose up -d

echo "=== 災難恢復測試完成 ==="
```

---

## 故障處理

### 常見問題處理流程圖

```
事件發生
    │
    ├─> 自動化系統檢測
    │   └─> 記錄事件
    │       └─> 觸發告警
    │
    ├─> 嚴重性評估
    │   ├─> P0: 立即響應
    │   ├─> P1: 15分鐘內響應
    │   ├─> P2: 1小時內響應
    │   └─> P3: 4小時內響應
    │
    ├─> 初步診斷
    │   └─> 使用診斷清單
    │
    ├─> 應急措施
    │   ├─> 自動回滾
    │   ├─> 服務降級
    │   └─> 流量切換
    │
    ├─> 根本原因分析
    │   └─> 永久修復
    │
    └─> 事後總結
        └─> 更新文檔
```

### 問題診斷清單

#### 🔴 P0: 生產完全中斷

**症狀識別**:
- ❌ 所有健康檢查失敗
- ❌ 用戶無法訪問服務
- ❌ 錯誤率 > 50%

**立即行動**:
```bash
# 1. 確認問題範圍
curl -f http://localhost:8001/health || echo "服務離線"
curl -f http://localhost:8002/health || echo "服務離線"
curl -f http://localhost:8003/health || echo "服務離線"

# 2. 觸發自動回滾
git describe --tags  # 確認當前版本
PREVIOUS_STABLE=$(git tag | grep -E '^v[0-9]+\.[0-9]+\.[0-9]+$' | tail -2 | head -1)
git checkout $PREVIOUS_STABLE

# 3. 快速重啟
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# 4. 驗證恢復
sleep 15
for service in flight-control gps-nav obstacle-detect; do
  curl -f http://localhost:8001/health && echo "✅ $service 恢復"
done

# 5. 通知團隊
echo "P0 事件已觸發回滾到 $PREVIOUS_STABLE" | tee incident-$(date +%Y%m%d-%H%M%S).log
```

**通知升級**:
```bash
# 立即通知
gh issue create \
  --title "P0 事件: 生產環境完全中斷" \
  --body "詳情: [incident-log-url]" \
  --label "incident,P0,urgent"
```

#### 🟠 P1: 關鍵功能受損

**症狀識別**:
- ⚠️ 部分服務健康檢查失敗
- ⚠️ 響應時間 > 5s
- ⚠️ 錯誤率 10-50%

**診斷步驟**:
```bash
# 1. 識別問題服務
docker-compose ps | grep -v "Up"

# 2. 查看服務日誌
docker-compose logs --tail=100 [failed-service] | grep ERROR

# 3. 檢查資源限制
docker stats --no-stream [failed-service]

# 4. 檢查依賴服務
docker-compose exec [failed-service] nc -zv database 5432
docker-compose exec [failed-service] nc -zv redis 6379

# 5. 嘗試服務重啟
docker-compose restart [failed-service]
sleep 10
curl -f http://localhost:800X/health
```

**修復措施**:
- 重啟問題服務
- 調整資源配置
- 降級非關鍵功能
- 啟用快取機制

#### 🟡 P2: 部分功能降級

**症狀識別**:
- ⚠️ 響應時間增加 2-5s
- ⚠️ 間歇性錯誤
- ⚠️ 資源使用接近上限

**優化步驟**:
```bash
# 1. 性能分析
docker stats --no-stream | sort -k 3 -hr

# 2. 識別瓶頸
docker-compose exec [service] top -b -n 1

# 3. 優化資源配置
# 編輯 docker-compose.yml 增加資源限制
cat >> docker-compose.yml << 'EOF'
services:
  [service]:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G
EOF

# 4. 應用更改
docker-compose up -d --force-recreate [service]

# 5. 監控改善
watch -n 5 'docker stats --no-stream [service]'
```

---

## 性能調優

### 資源優化策略

#### 1. CPU 優化

```yaml
# docker-compose.yml 調優
services:
  flight-control:
    cpus: '2.0'  # 限制 CPU 使用
    cpu_shares: 1024  # CPU 權重
    environment:
      - NODE_ENV=production
      - UV_THREADPOOL_SIZE=16  # Node.js 線程池
```

#### 2. 內存優化

```yaml
services:
  gps-nav:
    mem_limit: 2g
    mem_reservation: 1g
    environment:
      - NODE_OPTIONS=--max-old-space-size=1536
```

#### 3. 網路優化

```yaml
networks:
  app-network:
    driver: bridge
    driver_opts:
      com.docker.network.driver.mtu: 1500
```

### 性能基準測試

```bash
#!/bin/bash
# performance-benchmark.sh

echo "=== 性能基準測試 ==="

# 1. 響應時間測試
echo "1. 響應時間測試..."
for i in {1..100}; do
  curl -w '%{time_total}\n' -o /dev/null -s http://localhost:8001/health
done | awk '{sum+=$1; count++} END {print "平均響應時間:", sum/count, "秒"}'

# 2. 併發測試
echo ""
echo "2. 併發測試（100 請求）..."
ab -n 100 -c 10 http://localhost:8001/health

# 3. 負載測試
echo ""
echo "3. 負載測試..."
# 使用 Apache Bench 或 wrk
wrk -t4 -c100 -d30s http://localhost:8001/health

# 4. 資源使用峰值
echo ""
echo "4. 資源使用峰值..."
docker stats --no-stream
```

---

## 安全維護

### 安全檢查清單

```bash
#!/bin/bash
# security-audit.sh

echo "=== 安全審計 ==="

# 1. 掃描依賴漏洞
echo "1. 依賴漏洞掃描..."
npm audit --audit-level=moderate

# 2. Docker 映像掃描
echo ""
echo "2. Docker 映像安全掃描..."
for image in $(docker images --format "{{.Repository}}:{{.Tag}}" | grep -v none); do
  echo "掃描: $image"
  docker scan $image || echo "需要安裝 docker scan"
done

# 3. 檢查暴露的密鑰
echo ""
echo "3. 檢查密鑰洩漏..."
git secrets --scan || echo "需要安裝 git-secrets"

# 4. 檢查不安全的配置
echo ""
echo "4. 配置安全檢查..."
INSECURE_FILES=$(grep -l "password\|secret\|key" docker-compose.yml .env 2>/dev/null || echo "")
if [ -n "$INSECURE_FILES" ]; then
  echo "⚠️  以下檔案可能包含明文密鑰（請人工審查）："
  echo "$INSECURE_FILES"
else
  echo "✅ 無明文密鑰"
fi

# 5. 檢查權限設置
echo ""
echo "5. 文件權限檢查..."
find . -type f -perm -o+w ! -path "./node_modules/*" ! -path "./.git/*"
```

### 安全更新流程

```bash
#!/bin/bash
# security-update.sh

echo "=== 安全更新流程 ==="

# 1. 檢查可用更新
npm audit

# 2. 自動修復
npm audit fix

# 3. 手動審查重大更新
npm audit fix --force --dry-run

# 4. 運行測試
npm test

# 5. 更新依賴鎖定文件
npm ci

# 6. 提交更改
git add package*.json
git commit -m "security: update dependencies [security patch]"
```

---

## 災難恢復

### 備份策略

#### 自動備份腳本

```bash
#!/bin/bash
# automated-backup.sh

BACKUP_DIR="/backups/autonomous-ci"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)

# 1. 創建備份目錄
mkdir -p "$BACKUP_DIR/$TIMESTAMP"

# 2. 備份配置文件
cp -r .github/ "$BACKUP_DIR/$TIMESTAMP/"
cp -r docs/ "$BACKUP_DIR/$TIMESTAMP/"
cp docker-compose.yml "$BACKUP_DIR/$TIMESTAMP/"

# 3. 備份數據庫
# 檢查 docker-compose.yml 是否有 db 服務且 image 為 postgres
DB_SERVICE=$(docker-compose config --services | grep '^db$')
DB_IMAGE=$(docker-compose config | awk '/services:/,0' | awk '/db:/,0' | grep 'image:' | awk '{print $2}')
if [ -n "$DB_SERVICE" ] && [[ "$DB_IMAGE" == *postgres* ]]; then
  docker-compose exec -T db pg_dump -U postgres > "$BACKUP_DIR/$TIMESTAMP/database.sql" 2> "$BACKUP_DIR/$TIMESTAMP/database.err"
  if [ $? -eq 0 ]; then
    echo "✅ 資料庫備份成功"
  else
    echo "⚠️  資料庫備份失敗，請檢查 $BACKUP_DIR/$TIMESTAMP/database.err"
  fi
else
  echo "⚠️  未找到 PostgreSQL 資料庫服務 (db)，跳過資料庫備份"
fi
# 4. 備份工件
cp -r artifacts/ "$BACKUP_DIR/$TIMESTAMP/"

# 5. 創建清單
cat > "$BACKUP_DIR/$TIMESTAMP/manifest.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "git_commit": "$(git rev-parse HEAD)",
  "git_branch": "$(git branch --show-current)",
  "services": $(docker-compose ps --format json)
}
EOF

# 6. 壓縮備份
tar -czf "$BACKUP_DIR/backup-$TIMESTAMP.tar.gz" -C "$BACKUP_DIR" "$TIMESTAMP"

# 7. 清理舊備份（保留30天）
find "$BACKUP_DIR" -name "backup-*.tar.gz" -mtime +30 -delete

echo "✅ 備份完成: $BACKUP_DIR/backup-$TIMESTAMP.tar.gz"
```

### 恢復程序

```bash
#!/bin/bash
# restore-backup.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "用法: $0 <backup-file>"
  exit 1
fi

echo "=== 從備份恢復 ==="
echo "備份文件: $BACKUP_FILE"

# 1. 解壓備份
RESTORE_DIR="/tmp/restore-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$RESTORE_DIR"
tar -xzf "$BACKUP_FILE" -C "$RESTORE_DIR"

# 2. 停止當前服務
docker-compose down

# 3. 恢復配置
cp -r "$RESTORE_DIR"/*/.github/ .
cp -r "$RESTORE_DIR"/*/docs/ .
cp "$RESTORE_DIR"/*/docker-compose.yml .

# 4. 恢復數據庫
# 4.1 啟動資料庫容器
docker-compose up -d db

# 4.2 等待資料庫就緒（最多 60 秒）
echo "等待資料庫容器啟動與就緒..."
for i in {1..30}; do
  docker-compose exec db pg_isready -U postgres
  if [ $? -eq 0 ]; then
    echo "資料庫已就緒"
    break
  fi
  sleep 2
done
# 若超時仍未就緒則退出
docker-compose exec db pg_isready -U postgres
if [ $? -ne 0 ]; then
  echo "❌ 資料庫啟動逾時，請檢查容器日誌"
  exit 1
fi
BACKUP_SUBDIR=$(ls -1d "$RESTORE_DIR"/*/ | head -1)
if [ -f "$BACKUP_SUBDIR/database.sql" ]; then
  cat "$BACKUP_SUBDIR/database.sql" | docker-compose exec -T db psql -U postgres
  if [ $? -eq 0 ]; then
    echo "✅ 資料庫恢復成功"
  else
    echo "❌ 資料庫恢復失敗"
    exit 1
  fi
else
  echo "⚠️  未找到資料庫備份檔案"
fi

# 5. 重啟服務
docker-compose up -d

# 6. 驗證恢復
sleep 15
curl -f http://localhost:8001/health && echo "✅ 恢復成功"

echo "=== 恢復完成 ==="
```

---

## 監控和告警

### 監控儀表板設置

```yaml
# prometheus.yml
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'autonomous-ci'
    static_configs:
      - targets:
        - 'localhost:8001'
        - 'localhost:8002'
        - 'localhost:8003'
        - 'localhost:8004'
    metrics_path: '/metrics'
```

### 告警規則

```yaml
# alerts.yml
groups:
  - name: autonomous_ci_alerts
    interval: 30s
    rules:
      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "服務 {{ $labels.instance }} 離線"
          
      - alert: HighResponseTime
        expr: http_request_duration_seconds > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "響應時間過高: {{ $value }}s"
          
      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "錯誤率過高: {{ $value }}"
```

---

## 附錄

### A. 故障排除決策樹

```
問題發生
  │
  ├─ 服務無法啟動？
  │   ├─ 檢查配置文件
  │   ├─ 檢查依賴服務
  │   └─ 查看啟動日誌
  │
  ├─ 性能降級？
  │   ├─ 檢查資源使用
  │   ├─ 分析慢查詢
  │   └─ 優化配置
  │
  ├─ 間歇性錯誤？
  │   ├─ 檢查網路穩定性
  │   ├─ 分析並發問題
  │   └─ 審查錯誤模式
  │
  └─ 數據不一致？
      ├─ 檢查數據庫狀態
      ├─ 驗證數據完整性
      └─ 執行數據修復
```

### B. 有用的腳本和工具

#### 快速診斷腳本

```bash
#!/bin/bash
# quick-diagnose.sh

echo "🔍 快速診斷工具"
echo ""

# 系統信息
echo "系統信息:"
uname -a
echo ""

# 服務狀態
echo "服務狀態:"
docker-compose ps
echo ""

# 最近錯誤
echo "最近錯誤 (最後 20 行):"
docker-compose logs --tail=20 | grep -i error
echo ""

# 資源使用
echo "資源使用:"
docker stats --no-stream
echo ""

# 網路連接
echo "網路測試:"
ping -c 3 google.com > /dev/null && echo "✅ 外網連接正常" || echo "❌ 外網連接失敗"
echo ""

# GitHub Actions 狀態
echo "GitHub Actions 狀態:"
gh run list --workflow=autonomous-ci-guardian.yml --limit 5
```

### C. 聯繫和支援

**文檔維護**: DevOps Team  
**緊急聯繫**: Slack #critical-alerts  
**工單系統**: https://jira.example.com/projects/INFRA  
**最後更新**: 2025-11-26

---

*本運行手冊應定期更新並根據實際運營經驗改進。*
