# Security Policy / 安全政策

## 支援的版本 / Supported Versions

我們為以下版本提供安全更新：

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## 報告漏洞 / Reporting a Vulnerability

### 🔒 如何報告安全漏洞

我們非常重視安全問題的報告。如果您發現了安全漏洞，請**不要**通過公開的 Issue 報告。

#### 報告渠道

**首選方式**: 使用 GitHub Security Advisories
1. 前往 [Security Advisories](https://github.com/we-can-fix/slasolve/security/advisories)
2. 點擊 "Report a vulnerability"
3. 填寫詳細信息
4. 提交報告

**電子郵件**: security@slasolve.example.com

### 📋 報告應包含的信息

請在報告中包含以下信息：

- **漏洞類型**: SQL注入、XSS、CSRF 等
- **受影響的組件**: 具體的文件、功能或端點
- **漏洞描述**: 詳細說明問題
- **重現步驟**: 如何重現該漏洞
- **影響評估**: 潛在的安全影響
- **建議修復**: 如果有修復建議（可選）

### ⏱️ 響應時間表

| 階段 | 時間框架 |
|------|---------|
| 初步確認 | 24 小時內 |
| 漏洞評估 | 72 小時內 |
| 修復計畫 | 7 天內 |
| 補丁發布 | 根據嚴重程度 |

**嚴重程度與修復時間**:
- **Critical**: 4 小時內開始修復，24 小時內發布補丁
- **High**: 24 小時內開始修復，7 天內發布補丁
- **Medium**: 7 天內開始修復，30 天內發布補丁
- **Low**: 30 天內開始修復，90 天內發布補丁

### 🔐 安全功能

本專案實施了以下安全措施：

#### 自動化安全掃描
- **CodeQL**: 靜態應用安全測試 (SAST)
  - 支援 8 種程式語言
  - 自定義企業級查詢規則
  - 每週自動掃描

- **Secret Scanning**: 秘密檢測
  - 30+ 種秘密模式
  - Push protection 推送保護
  - 即時檢測和阻擋

- **Dependency Scanning**: 依賴項掃描
  - Dependabot 自動更新
  - 漏洞自動修復
  - SLA 驅動的修復流程

#### 安全工作流程
- PR 安全閘門：Critical 級別自動阻擋合併
- 漏洞自動修復：每日掃描和智能修復
- 秘密旁路審批：標準化的例外處理流程

### 📊 安全監控

我們使用以下工具監控安全狀態：

- **Prometheus**: 指標收集和告警
- **Elasticsearch**: 日誌聚合和分析
- **GitHub Advanced Security**: 全方位安全平台

### 🔍 負責任的披露政策

我們遵循負責任的披露原則：

1. **保密期**: 我們要求在修復發布前保密（通常 90 天）
2. **協調披露**: 我們會與報告者協調披露時間
3. **致謝**: 我們會在修復發布時公開感謝報告者（如果同意）
4. **CVE 分配**: 對於符合條件的漏洞，我們會申請 CVE 編號

### 📚 安全資源

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [CWE Top 25](https://cwe.mitre.org/top25/)
- [NIST Cybersecurity Framework](https://www.nist.gov/cyberframework)

### 🔗 相關文檔

- [GHAS 完整實施指南](docs/GHAS_COMPLETE_GUIDE.md)
- [CodeQL 設定指南](docs/CODEQL_SETUP.md)
- [Secret Scanning 指南](docs/SECRET_SCANNING.md)
- [漏洞管理流程](docs/VULNERABILITY_MANAGEMENT.md)

### 📞 聯絡方式

- **安全團隊郵箱**: security@slasolve.example.com
- **緊急聯絡**: emergency-security@slasolve.example.com

### 🔄 政策更新

本安全政策最後更新日期: 2025-11-22

---

## English Version

### Reporting Security Issues

Please report security vulnerabilities through GitHub Security Advisories or email security@slasolve.example.com.

**DO NOT** report security vulnerabilities through public GitHub issues.

### Response Timeline

- Initial Response: Within 24 hours
- Assessment: Within 72 hours
- Fix Plan: Within 7 days
- Patch Release: Based on severity

### Security Features

- CodeQL SAST across 8 languages
- Secret Scanning with 30+ patterns
- Automated vulnerability remediation
- Security-focused PR gates

For detailed security documentation, see [GHAS Complete Guide](docs/GHAS_COMPLETE_GUIDE.md).

---

Thank you for helping keep SLASolve secure!
