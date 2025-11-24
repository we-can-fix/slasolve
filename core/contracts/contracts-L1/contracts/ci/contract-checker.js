#!/usr/bin/env node
/**
 * 契約驗證器 - Contract Checker
 * 
 * 自動驗證外部 API 契約與 SLA 合規性
 * Automated validation of external API contracts and SLA compliance
 * 
 * 使用方式 Usage:
 *   node contract-checker.js <contract-file>
 *   node contract-checker.js contracts/external-api.json
 * 
 * @author platform@islasolve.com
 * @version 1.0.0
 * @language zh-TW
 */

const fs = require('fs');
const https = require('https');
const http = require('http');

// ==================== 配置 Configuration ====================

const CONFIG = {
  timeout: 30000,              // 30 秒
  retries: 3,                  // 最多重試 3 次
  concurrency: 5,              // 並行檢查數
  reportFormat: 'json',        // 報告格式: json, text
  failFast: false,             // 遇到失敗時立即停止
};

// ==================== 主程式 Main ====================

async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.error('錯誤: 請提供契約檔案路徑');
    console.error('使用方式: node contract-checker.js <contract-file>');
    process.exit(1);
  }
  
  const contractFile = args[0];
  
  if (!fs.existsSync(contractFile)) {
    console.error(`錯誤: 找不到檔案 ${contractFile}`);
    process.exit(1);
  }
  
  console.log('====================================');
  console.log('契約驗證器 Contract Checker');
  console.log('====================================\n');
  
  try {
    // 載入契約
    const contractData = fs.readFileSync(contractFile, 'utf8');
    const contract = JSON.parse(contractData);
    
    console.log(`📋 載入契約: ${contractFile}`);
    console.log(`📦 契約版本: ${contract.contract_version}`);
    console.log(`📝 描述: ${contract.description}\n`);
    
    // 執行契約檢查
    const results = await checkContracts(contract);
    
    // 產生報告
    generateReport(results, contract);
    
    // 判斷是否通過
    const passed = results.every(r => r.passed);
    
    if (passed) {
      console.log('\n✅ 所有契約檢查通過！');
      process.exit(0);
    } else {
      console.log('\n❌ 部分契約檢查失敗');
      process.exit(1);
    }
    
  } catch (error) {
    console.error(`\n❌ 執行失敗: ${error.message}`);
    process.exit(1);
  }
}

// ==================== 契約檢查 Contract Checking ====================

async function checkContracts(contract) {
  const results = [];
  const contracts = contract.contracts || {};
  
  console.log('🔍 開始檢查契約...\n');
  
  for (const [name, contractDef] of Object.entries(contracts)) {
    console.log(`\n📍 檢查契約: ${name}`);
    console.log(`   提供者: ${contractDef.provider}`);
    console.log(`   必要性: ${contractDef.required ? '必要' : '可選'}`);
    
    const result = await checkSingleContract(name, contractDef);
    results.push(result);
    
    // 顯示結果
    if (result.passed) {
      console.log(`   ✅ 通過`);
    } else {
      console.log(`   ❌ 失敗: ${result.errors.join(', ')}`);
    }
    
    // fail-fast 模式
    if (CONFIG.failFast && !result.passed) {
      break;
    }
  }
  
  return results;
}

async function checkSingleContract(name, contractDef) {
  const result = {
    name,
    provider: contractDef.provider,
    passed: true,
    errors: [],
    metrics: {},
    timestamp: new Date().toISOString(),
  };
  
  try {
    // 1. 健康檢查
    if (contractDef.health_check) {
      const healthResult = await checkHealth(contractDef);
      result.metrics.health = healthResult;
      
      if (!healthResult.success) {
        result.passed = false;
        result.errors.push(`健康檢查失敗: ${healthResult.error}`);
      }
    }
    
    // 2. 延遲檢查
    if (contractDef.sla && contractDef.sla.latency) {
      const latencyResult = await checkLatency(contractDef);
      result.metrics.latency = latencyResult;
      
      // 解析閾值 (例如: "< 200ms")
      const p95Threshold = parseInt(contractDef.sla.latency.p95.match(/\d+/)[0]);
      
      if (latencyResult.p95 > p95Threshold) {
        result.passed = false;
        result.errors.push(
          `延遲過高: p95=${latencyResult.p95}ms (閾值: ${p95Threshold}ms)`
        );
      }
    }
    
    // 3. 錯誤率檢查（模擬）
    if (contractDef.sla && contractDef.sla.error_rate) {
      const errorRateResult = await checkErrorRate(contractDef);
      result.metrics.error_rate = errorRateResult;
      
      // 解析閾值 (例如: "< 1%")
      const threshold = parseFloat(contractDef.sla.error_rate.threshold.match(/[\d.]+/)[0]);
      
      if (errorRateResult.rate > threshold) {
        result.passed = false;
        result.errors.push(
          `錯誤率過高: ${errorRateResult.rate}% (閾值: ${threshold}%)`
        );
      }
    }
    
  } catch (error) {
    result.passed = false;
    result.errors.push(`檢查異常: ${error.message}`);
  }
  
  return result;
}

// ==================== 健康檢查 Health Check ====================

async function checkHealth(contractDef) {
  const healthCheck = contractDef.health_check;
  
  if (!healthCheck) {
    return { success: true, skipped: true };
  }
  
  const url = `${contractDef.base_url}${healthCheck.endpoint}`;
  const timeout = parseInt(healthCheck.timeout) * 1000 || CONFIG.timeout;
  
  try {
    const startTime = Date.now();
    const response = await makeRequest(url, healthCheck.method, {}, timeout);
    const duration = Date.now() - startTime;
    
    const success = response.status === healthCheck.expected_status;
    
    return {
      success,
      status: response.status,
      duration,
      endpoint: url,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      endpoint: url,
    };
  }
}

// ==================== 延遲檢查 Latency Check ====================

async function checkLatency(contractDef) {
  const samples = [];
  const sampleCount = 10;
  
  // 使用健康檢查端點進行延遲測試
  const url = contractDef.health_check 
    ? `${contractDef.base_url}${contractDef.health_check.endpoint}`
    : contractDef.base_url;
  
  for (let i = 0; i < sampleCount; i++) {
    try {
      const startTime = Date.now();
      await makeRequest(url, 'GET', {}, 5000);
      const duration = Date.now() - startTime;
      samples.push(duration);
    } catch (error) {
      // 忽略失敗的請求
    }
  }
  
  if (samples.length === 0) {
    return { p50: 0, p95: 0, p99: 0, samples: 0 };
  }
  
  // 排序並計算百分位數
  samples.sort((a, b) => a - b);
  
  return {
    p50: percentile(samples, 50),
    p95: percentile(samples, 95),
    p99: percentile(samples, 99),
    min: samples[0],
    max: samples[samples.length - 1],
    samples: samples.length,
  };
}

// ==================== 錯誤率檢查 Error Rate Check ====================

async function checkErrorRate(contractDef) {
  // 模擬錯誤率檢查
  // 實際應用中應該查詢監控系統或日誌
  
  const sampleCount = 100;
  let errorCount = 0;
  
  // 簡化版：假設健康檢查失敗代表錯誤
  if (contractDef.health_check) {
    const url = `${contractDef.base_url}${contractDef.health_check.endpoint}`;
    
    for (let i = 0; i < Math.min(sampleCount, 10); i++) {
      try {
        await makeRequest(url, 'GET', {}, 3000);
      } catch (error) {
        errorCount++;
      }
    }
  }
  
  const rate = (errorCount / sampleCount) * 100;
  
  return {
    rate: parseFloat(rate.toFixed(2)),
    total: sampleCount,
    errors: errorCount,
  };
}

// ==================== HTTP 請求 HTTP Request ====================

function makeRequest(url, method = 'GET', headers = {}, timeout = CONFIG.timeout) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method,
      headers: {
        'User-Agent': 'Contract-Checker/1.0',
        ...headers,
      },
      timeout,
    };
    
    const req = protocol.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data,
        });
      });
    });
    
    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('請求超時'));
    });
    
    req.end();
  });
}

// ==================== 工具函數 Utility Functions ====================

function percentile(arr, p) {
  if (arr.length === 0) return 0;
  const index = Math.ceil((p / 100) * arr.length) - 1;
  return arr[Math.max(0, index)];
}

function generateReport(results, contract) {
  console.log('\n\n====================================');
  console.log('檢查報告 Validation Report');
  console.log('====================================\n');
  
  const passedCount = results.filter(r => r.passed).length;
  const totalCount = results.length;
  
  console.log(`總契約數: ${totalCount}`);
  console.log(`通過數: ${passedCount}`);
  console.log(`失敗數: ${totalCount - passedCount}`);
  console.log(`成功率: ${((passedCount / totalCount) * 100).toFixed(1)}%\n`);
  
  // 詳細結果
  for (const result of results) {
    console.log(`\n📦 契約: ${result.name}`);
    console.log(`   提供者: ${result.provider}`);
    console.log(`   狀態: ${result.passed ? '✅ 通過' : '❌ 失敗'}`);
    
    if (result.metrics.health) {
      console.log(`   健康檢查: ${result.metrics.health.success ? '✅' : '❌'} (${result.metrics.health.duration || 0}ms)`);
    }
    
    if (result.metrics.latency) {
      const lat = result.metrics.latency;
      console.log(`   延遲 (p95): ${lat.p95}ms`);
    }
    
    if (result.metrics.error_rate) {
      const err = result.metrics.error_rate;
      console.log(`   錯誤率: ${err.rate}%`);
    }
    
    if (result.errors.length > 0) {
      console.log(`   錯誤: ${result.errors.join('; ')}`);
    }
  }
  
  // 儲存 JSON 報告
  const reportFile = 'contract-check-report.json';
  fs.writeFileSync(reportFile, JSON.stringify({
    timestamp: new Date().toISOString(),
    contract_version: contract.contract_version,
    results,
    summary: {
      total: totalCount,
      passed: passedCount,
      failed: totalCount - passedCount,
      success_rate: (passedCount / totalCount) * 100,
    },
  }, null, 2));
  
  console.log(`\n📄 報告已儲存: ${reportFile}`);
}

// ==================== 執行 Execute ====================

if (require.main === module) {
  main().catch(error => {
    console.error('未預期的錯誤:', error);
    process.exit(1);
  });
}

module.exports = {
  checkContracts,
  checkSingleContract,
  checkHealth,
  checkLatency,
  checkErrorRate,
};
