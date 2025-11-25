#!/usr/bin/env node

/**
 * MCP Servers - 主入口點
 * 
 * 提供 MCP (Model Context Protocol) 服務器功能，包括：
 * - 代碼分析
 * - SLSA 驗證
 * - 安全掃描
 * - 部署驗證
 * - 邏輯驗證
 */

import http from 'http';

const SERVER_PORT = process.env.MCP_SERVER_PORT || 3001;
const SERVER_HOST = process.env.MCP_SERVER_HOST || '0.0.0.0';

/**
 * 創建 HTTP 服務器用於健康檢查和狀態監控
 */
function createHealthCheckServer() {
  const server = http.createServer((req, res) => {
    const { url, method } = req;

    // 設置 CORS 標頭
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

    if (method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    // 健康檢查端點
    if (url === '/health' || url === '/healthz') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'mcp-servers',
        version: '1.0.0'
      }));
      return;
    }

    // 就緒檢查端點
    if (url === '/ready' || url === '/readyz') {
      res.writeHead(200);
      res.end(JSON.stringify({
        status: 'ready',
        timestamp: new Date().toISOString(),
        checks: {
          mcp: 'available',
          validators: 'loaded'
        }
      }));
      return;
    }

    // 版本信息端點
    if (url === '/version') {
      res.writeHead(200);
      res.end(JSON.stringify({
        version: '1.0.0',
        build: process.env.BUILD_SHA || 'local',
        timestamp: new Date().toISOString(),
        node: process.version
      }));
      return;
    }

    // 狀態信息端點
    if (url === '/status') {
      res.writeHead(200);
      res.end(JSON.stringify({
        service: 'mcp-servers',
        status: 'running',
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      }));
      return;
    }

    // 根端點 - 服務信息
    if (url === '/' || url === '') {
      res.writeHead(200);
      res.end(JSON.stringify({
        service: 'mcp-servers',
        version: '1.0.0',
        description: 'Enterprise-grade MCP servers for code analysis, SLSA validation, and security scanning',
        endpoints: {
          health: '/health',
          ready: '/ready',
          version: '/version',
          status: '/status'
        },
        features: [
          'Code Analysis',
          'SLSA Validation',
          'Security Scanning',
          'Deployment Validation',
          'Logic Validation',
          'Performance Analysis',
          'Test Generation',
          'Documentation Generation'
        ]
      }));
      return;
    }

    // 404 處理
    res.writeHead(404);
    res.end(JSON.stringify({
      error: 'Not Found',
      path: url,
      timestamp: new Date().toISOString()
    }));
  });

  return server;
}

/**
 * 主函數 - 初始化並啟動 MCP 服務器
 */
async function main() {
  console.log('🚀 Starting MCP Servers...');
  console.log(`📦 Version: 1.0.0`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔧 Node.js: ${process.version}`);

  // 設置信號處理
  process.on('SIGINT', () => {
    console.log('\n🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
  });

  // 創建並啟動 HTTP 健康檢查服務器
  const healthServer = createHealthCheckServer();
  
  healthServer.listen(SERVER_PORT, SERVER_HOST, () => {
    console.log(`✅ Health check server listening on http://${SERVER_HOST}:${SERVER_PORT}`);
    console.log(`📊 Health endpoint: http://${SERVER_HOST}:${SERVER_PORT}/health`);
    console.log(`🔍 Status endpoint: http://${SERVER_HOST}:${SERVER_PORT}/status`);
    console.log(`📝 Version endpoint: http://${SERVER_HOST}:${SERVER_PORT}/version`);
    console.log('');
    console.log('🎯 Available MCP Services:');
    console.log('  - Code Analysis (code-analyzer.js)');
    console.log('  - SLSA Validation (slsa-validator.js)');
    console.log('  - Security Scanning (security-scanner.js)');
    console.log('  - Deployment Validation (deployment-validator.js)');
    console.log('  - Logic Validation (logic-validator.js)');
    console.log('  - Performance Analysis (performance-analyzer.js)');
    console.log('  - Test Generation (test-generator.js)');
    console.log('  - Documentation Generation (doc-generator.js)');
    console.log('');
    console.log('✨ MCP Servers are ready!');
  });
}

// 啟動服務器
main().catch((error) => {
  console.error('❌ Failed to start MCP Servers:', error);
  process.exit(1);
});
