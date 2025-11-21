# SLASolve MCP Servers

Enterprise-grade Model Context Protocol (MCP) servers for the AutoExecutionEngine Agent.

## 🎯 Overview

This directory contains six specialized MCP servers that provide advanced capabilities for code analysis, testing, documentation, SLSA validation, security scanning, and performance optimization.

## 📦 MCP Servers

### 1. Code Analyzer (`code-analyzer.js`)
**Capabilities:**
- `analyze-code` - Comprehensive code quality and complexity analysis
- `detect-issues` - Issue detection with severity filtering
- `suggest-improvements` - AI-powered code improvement suggestions

**Features:**
- Cyclomatic and cognitive complexity calculation
- Security vulnerability detection
- Performance issue identification
- Best practice validation
- Code smell detection

### 2. Test Generator (`test-generator.js`)
**Capabilities:**
- `generate-unit-tests` - Generate unit tests for functions and classes
- `generate-integration-tests` - Generate API integration tests
- `generate-e2e-tests` - Generate end-to-end test scenarios

**Features:**
- Multiple framework support (Jest, Mocha, Vitest, Playwright, Cypress)
- Configurable coverage levels (basic, comprehensive, exhaustive)
- Automatic test scaffold generation
- Edge case and error handling tests

### 3. Documentation Generator (`doc-generator.js`)
**Capabilities:**
- `generate-jsdoc` - Generate JSDoc documentation
- `generate-api-docs` - Generate API documentation (Markdown, OpenAPI)
- `generate-guides` - Generate comprehensive guides

**Features:**
- Multiple documentation styles (standard, Google, TypeScript)
- Automatic API reference generation
- Context-aware guide generation
- Multiple output formats (Markdown, OpenAPI, Postman)

### 4. SLSA Validator (`slsa-validator.js`)
**Capabilities:**
- `validate-provenance` - Validate SLSA provenance data
- `check-slsa-compliance` - Check compliance for target SLSA level
- `generate-compliance-report` - Generate comprehensive compliance reports

**Features:**
- SLSA Level 1-4 validation
- Compliance gap analysis
- Remediation recommendations
- Detailed compliance reporting

### 5. Security Scanner (`security-scanner.js`)
**Capabilities:**
- `scan-vulnerabilities` - Scan for security vulnerabilities
- `check-dependencies` - Check dependencies for known CVEs
- `analyze-secrets` - Detect exposed secrets and credentials

**Features:**
- SQL injection detection
- XSS vulnerability detection
- Command injection detection
- Hardcoded secret detection
- Dependency vulnerability checking
- CWE and OWASP mapping

### 6. Performance Analyzer (`performance-analyzer.js`)
**Capabilities:**
- `analyze-performance` - Analyze code performance metrics
- `identify-bottlenecks` - Identify performance bottlenecks
- `suggest-optimizations` - Suggest performance optimizations

**Features:**
- Complexity analysis (cyclomatic, cognitive, Halstead)
- Memory usage analysis
- Loop optimization detection
- Async performance analysis
- Bottleneck identification
- Optimization recommendations

## 🚀 Installation

```bash
cd mcp-servers
npm install
```

## 📖 Usage

### Running Individual Servers

Each server can be run independently:

```bash
node code-analyzer.js
node test-generator.js
node doc-generator.js
node slsa-validator.js
node security-scanner.js
node performance-analyzer.js
```

### Configuration

Servers can be configured via environment variables:

```bash
# For SLSA Validator
export SLSA_LEVELS="1,2,3,4"

# For all servers
export NODE_ENV="production"
export LOG_LEVEL="info"
```

### Integration with Agent

The MCP servers are automatically configured in `.github/agents/my-agent.agent.md`:

```yaml
mcp-servers:
  - name: code-analyzer
    command: node
    args: ["./mcp-servers/code-analyzer.js"]
    capabilities:
      - analyze-code
      - detect-issues
      - suggest-improvements
  # ... (additional servers)
```

## 🔧 Development

### Running Lint

```bash
npm run lint
```

### Running Tests

```bash
npm test
```

## 📝 Example Usage

### Code Analysis Example

```javascript
// Input
const request = {
  name: 'analyze-code',
  arguments: {
    code: 'function example() { ... }',
    language: 'javascript',
    options: {
      checkComplexity: true,
      checkSecurity: true
    }
  }
};

// Output
{
  "language": "javascript",
  "metrics": {
    "totalLines": 10,
    "codeLines": 8,
    "commentLines": 1
  },
  "complexity": {
    "cyclomatic": 3,
    "cognitive": 2,
    "rating": "A - Simple"
  },
  "issues": [],
  "score": 95
}
```

### SLSA Validation Example

```javascript
// Input
const request = {
  name: 'validate-provenance',
  arguments: {
    provenance: {
      _type: "https://in-toto.io/Statement/v0.1",
      predicateType: "https://slsa.dev/provenance/v0.2",
      subject: [...],
      predicate: {...}
    },
    level: '3'
  }
};

// Output
{
  "valid": true,
  "level": "3",
  "checks": [...],
  "errors": [],
  "warnings": [],
  "score": 95
}
```

## 🏗️ Architecture

All MCP servers follow the same architectural pattern:

1. **Server Initialization** - Create MCP server with capabilities
2. **Tool Registration** - Register available tools and schemas
3. **Request Handling** - Handle tool calls with validation
4. **Response Generation** - Return structured results
5. **Error Handling** - Comprehensive error handling and validation

## 🔒 Security

- All servers use Zod for input validation
- No external network calls without explicit permission
- Secrets are masked in analysis output
- Follow principle of least privilege

## 📊 Performance

- Efficient pattern matching algorithms
- Minimal memory footprint
- Fast response times (<100ms for most operations)
- Async/await for non-blocking operations

## 🤝 Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for guidelines.

## 📄 License

MIT License - see [LICENSE](../LICENSE) for details.

## 🆘 Support

For issues and questions:
- Open an issue in the repository
- Check documentation at `/docs`
- Contact the SLASolve team

---

**Version:** 1.0.0  
**Last Updated:** November 2025  
**Maintainer:** SLASolve Team
