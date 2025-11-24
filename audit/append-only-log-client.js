#!/usr/bin/env node
/**
 * ==============================================================================
 * Append-Only Log Client - 不可變審計日誌客戶端
 * ==============================================================================
 * 用途: 將所有策略決定、測試結果、CD 決策寫入不可變事件帳本
 * 語言: 繁體中文註解
 * ==============================================================================
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Append-Only Log Client
 * 提供不可變審計日誌的寫入與驗證功能
 */
class AppendOnlyLogClient {
  constructor(options = {}) {
    this.logDir = options.logDir || path.join(process.cwd(), 'audit', 'logs');
    this.currentLogFile = options.logFile || 'audit-log.jsonl';
    this.enableSignature = options.enableSignature !== false;
    this.verbose = options.verbose || false;
    
    // 確保日誌目錄存在
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  /**
   * 計算事件雜湊 (SHA3-512)
   */
  hashEvent(event) {
    const data = JSON.stringify(event, Object.keys(event).sort());
    return crypto.createHash('sha3-512').update(data).digest('hex');
  }

  /**
   * 取得前一個事件的雜湊
   */
  getPreviousHash() {
    const logPath = path.join(this.logDir, this.currentLogFile);
    
    if (!fs.existsSync(logPath)) {
      return '0'.repeat(128); // 創世區塊雜湊
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return '0'.repeat(128);
    }
    
    const lastEvent = JSON.parse(lines[lines.length - 1]);
    return lastEvent.hash;
  }

  /**
   * 添加事件到審計日誌
   * 
   * @param {Object} event - 事件資料
   * @param {string} event.type - 事件類型 (policy_test, cd_decision, deployment, rollback)
   * @param {string} event.action - 執行動作
   * @param {Object} event.data - 事件資料
   * @param {Object} event.metadata - 元資料
   */
  async append(event) {
    try {
      // 驗證必要欄位
      if (!event.type || !event.action) {
        throw new Error('事件必須包含 type 和 action 欄位');
      }

      // 建立審計事件
      const auditEvent = {
        timestamp: new Date().toISOString(),
        type: event.type,
        action: event.action,
        data: event.data || {},
        metadata: {
          ...event.metadata,
          source: event.metadata?.source || 'unknown',
          actor: event.metadata?.actor || process.env.USER || 'system',
          environment: event.metadata?.environment || process.env.NODE_ENV || 'production',
          commit_sha: event.metadata?.commit_sha || process.env.GITHUB_SHA || 'unknown',
          workflow_id: event.metadata?.workflow_id || process.env.GITHUB_RUN_ID || 'unknown'
        },
        previousHash: this.getPreviousHash(),
        sequence: this.getNextSequence()
      };

      // 計算當前事件雜湊
      auditEvent.hash = this.hashEvent(auditEvent);

      // 如果啟用簽章，添加簽章
      if (this.enableSignature) {
        auditEvent.signature = this.signEvent(auditEvent);
      }

      // 寫入日誌檔案
      const logPath = path.join(this.logDir, this.currentLogFile);
      const logEntry = JSON.stringify(auditEvent) + '\n';
      fs.appendFileSync(logPath, logEntry, 'utf8');

      if (this.verbose) {
        console.log('✅ 審計事件已記錄:', {
          type: auditEvent.type,
          action: auditEvent.action,
          sequence: auditEvent.sequence,
          hash: auditEvent.hash.substring(0, 16) + '...'
        });
      }

      return auditEvent;
    } catch (error) {
      console.error('❌ 寫入審計日誌失敗:', error.message);
      throw error;
    }
  }

  /**
   * 取得下一個序號
   */
  getNextSequence() {
    const logPath = path.join(this.logDir, this.currentLogFile);
    
    if (!fs.existsSync(logPath)) {
      return 1;
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    return lines.length + 1;
  }

  /**
   * 簽署事件 (簡易版，實際應使用真實密鑰)
   */
  signEvent(event) {
    const data = JSON.stringify(event);
    const hmac = crypto.createHmac('sha256', process.env.AUDIT_SECRET || 'default-secret');
    return hmac.update(data).digest('hex');
  }

  /**
   * 驗證日誌完整性
   */
  async verify() {
    const logPath = path.join(this.logDir, this.currentLogFile);
    
    if (!fs.existsSync(logPath)) {
      console.log('⚠️  日誌檔案不存在');
      return { valid: true, errors: [] };
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    const errors = [];
    let previousHash = '0'.repeat(128);
    
    for (let i = 0; i < lines.length; i++) {
      const event = JSON.parse(lines[i]);
      
      // 驗證序號
      if (event.sequence !== i + 1) {
        errors.push(`序號錯誤: 預期 ${i + 1}, 實際 ${event.sequence}`);
      }
      
      // 驗證前一個雜湊
      if (event.previousHash !== previousHash) {
        errors.push(`雜湊鏈斷裂: 事件 ${event.sequence}`);
      }
      
      // 驗證當前雜湊
      const computedHash = this.hashEvent({
        ...event,
        hash: undefined,
        signature: undefined
      });
      
      if (event.hash !== computedHash) {
        errors.push(`雜湊不符: 事件 ${event.sequence}`);
      }
      
      previousHash = event.hash;
    }
    
    const result = {
      valid: errors.length === 0,
      totalEvents: lines.length,
      errors
    };
    
    if (this.verbose) {
      if (result.valid) {
        console.log(`✅ 日誌驗證通過: ${result.totalEvents} 個事件`);
      } else {
        console.log(`❌ 日誌驗證失敗: ${errors.length} 個錯誤`);
        errors.forEach(error => console.log(`  - ${error}`));
      }
    }
    
    return result;
  }

  /**
   * 查詢事件
   */
  async query(filter = {}) {
    const logPath = path.join(this.logDir, this.currentLogFile);
    
    if (!fs.existsSync(logPath)) {
      return [];
    }
    
    const content = fs.readFileSync(logPath, 'utf8');
    const lines = content.trim().split('\n').filter(line => line.trim());
    
    let events = lines.map(line => JSON.parse(line));
    
    // 應用過濾器
    if (filter.type) {
      events = events.filter(e => e.type === filter.type);
    }
    
    if (filter.action) {
      events = events.filter(e => e.action === filter.action);
    }
    
    if (filter.since) {
      events = events.filter(e => new Date(e.timestamp) >= new Date(filter.since));
    }
    
    if (filter.until) {
      events = events.filter(e => new Date(e.timestamp) <= new Date(filter.until));
    }
    
    return events;
  }

  /**
   * 生成審計報告
   */
  async generateReport(options = {}) {
    const events = await this.query(options.filter || {});
    
    const report = {
      generated_at: new Date().toISOString(),
      total_events: events.length,
      period: {
        start: events[0]?.timestamp,
        end: events[events.length - 1]?.timestamp
      },
      by_type: {},
      by_action: {},
      events: options.includeEvents ? events : undefined
    };
    
    // 統計事件類型
    events.forEach(event => {
      report.by_type[event.type] = (report.by_type[event.type] || 0) + 1;
      report.by_action[event.action] = (report.by_action[event.action] || 0) + 1;
    });
    
    return report;
  }
}

// CLI 介面
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  const client = new AppendOnlyLogClient({ verbose: true });
  
  switch (command) {
    case 'append':
      const event = {
        type: args[1] || 'test',
        action: args[2] || 'test_action',
        data: { message: args[3] || 'Test event' },
        metadata: {}
      };
      client.append(event);
      break;
    
    case 'verify':
      client.verify();
      break;
    
    case 'query':
      client.query({ type: args[1] }).then(events => {
        console.log(JSON.stringify(events, null, 2));
      });
      break;
    
    case 'report':
      client.generateReport({ includeEvents: false }).then(report => {
        console.log(JSON.stringify(report, null, 2));
      });
      break;
    
    default:
      console.log('用法:');
      console.log('  append <type> <action> <message>  - 添加事件');
      console.log('  verify                            - 驗證日誌完整性');
      console.log('  query <type>                      - 查詢事件');
      console.log('  report                            - 生成報告');
  }
}

module.exports = AppendOnlyLogClient;

// ==============================================================================
// 使用範例
// ==============================================================================
// const AuditLog = require('./append-only-log-client');
// const log = new AuditLog();
//
// // 記錄策略測試
// await log.append({
//   type: 'policy_test',
//   action: 'conftest_run',
//   data: { result: 'passed', violations: 0 },
//   metadata: { source: 'ci', actor: 'github-actions' }
// });
//
// // 記錄部署決策
// await log.append({
//   type: 'cd_decision',
//   action: 'deploy_approved',
//   data: { environment: 'production', version: 'v2.0.0' },
//   metadata: { source: 'argocd', actor: 'platform-team' }
// });
//
// // 驗證日誌
// await log.verify();
// ==============================================================================
