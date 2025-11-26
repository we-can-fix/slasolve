# SLASolve 專案目錄結構圖譜

> 產生時間 / Generated at: 2025-11-26 08:15:37 UTC
> 專案根目錄 / Project root: `/home/runner/work/slasolve/slasolve`

---

## 📂 完整目錄結構 / Complete Directory Structure

```
.
├── .auto-fix-bot.yml
├── .gitignore
├── ADVANCED_SYSTEM_INTEGRATION.md
├── AUTO_FIX_BOT.md
├── AUTO_FIX_BOT_GUIDE.md
├── CHANGELOG.md
├── COMPREHENSIVE_IMPLEMENTATION_REPORT.md
├── CONTRIBUTING.md
├── DELEGATION_WORKFLOW.md
├── DIRECTORY_STRUCTURE.md
├── DeploymentGuide.txt
├── FileDescription.txt
├── GHAS_IMPLEMENTATION_SUMMARY.md
├── MONITORING_GUIDE.md
├── PHASE1_IMPLEMENTATION_SUMMARY.md
├── PHASE1_VALIDATION_REPORT.md
├── PRODUCTION_READINESS.md
├── README.en.md
├── README.md
├── ROOT_README.md
├── SECURITY.md
├── auto-fix-bot .prompt.yml
├── auto-fix-bot-dashboard.html
├── auto-fix-bot.prompt.yml
├── auto-fix-bot.yml
├── cloud-agent-delegation.yml
├── deploy.sh
├── docker-compose.yml
├── nginx.conf
├── package-lock.json
├── package.json
├── .autofix
│   ├── config.json
│   └── rules
│       ├── performance-rules.yaml
│       └── security-rules.yaml
├── .config
│   └── conftest
│       └── policies
│           ├── naming_policy.rego
│           └── matechat-integration
│               ├── README.md
│               └── integration-policy.rego
├── .devcontainer
│   ├── CHANGELOG.md
│   ├── Dockerfile
│   ├── KB.md
│   ├── QUICK_START.md
│   ├── README.md
│   ├── SOLUTION_SUMMARY.md
│   ├── TEST-GUIDE.md
│   ├── devcontainer.json
│   ├── docker-compose.dev.yml
│   ├── docker-compose.yml
│   ├── install-optional-tools.sh
│   ├── life-system-README.md
│   ├── post-create.sh
│   ├── post-start.sh
│   ├── prometheus.yml
│   ├── requirements.txt
│   ├── setup.sh
│   └── start-dev-server.sh
├── .docker-templates
│   ├── NODEJS_USER_SETUP.md
│   └── validate-dockerfiles.sh
├── .github
│   ├── CODEOWNERS
│   ├── FUNDING.yml
│   ├── auto-review-config.yml
│   ├── copilot-instructions.md
│   ├── dependabot.yml
│   ├── security-policy.yml
│   ├── agents
│   │   └── my-agent.agent.md
│   ├── codeql
│   │   ├── codeql-config.yml
│   │   └── custom-queries
│   │       ├── enterprise-security.ql
│   │       └── qlpack.yml
│   ├── scripts
│   │   └── auto-fix-imports.sh
│   ├── secret-scanning
│   │   └── custom-patterns.yml
│   └── workflows
│       ├── advanced-system-cd.yml
│       ├── auto-review-merge.yml
│       ├── auto-vulnerability-fix.yml
│       ├── autofix-bot.yml
│       ├── ci-auto-comment.yml
│       ├── code-scanning.yml
│       ├── codeql-advanced.yml
│       ├── compliance-report.yml
│       ├── conftest-validation.yml
│       ├── contracts-cd.yml
│       ├── core-services-ci.yml
│       ├── deploy-contracts-l1.yml
│       ├── dynamic-ci-assistant.yml
│       ├── integration-deployment.yml
│       ├── interactive-ci-service.yml
│       ├── language-check.yml
│       ├── mcp-servers-cd.yml
│       ├── monorepo-dispatch.yml
│       ├── phase1-integration.yml
│       ├── policy-simulate.yml
│       ├── pr-security-gate.yml
│       ├── project-cd.yml
│       ├── reusable-ci.yml
│       ├── secret-bypass-request.yml
│       ├── secret-protection.yml
│       ├── setup-ci-env.yml
│       ├── setup-runner.yml
│       ├── stage-1-basic-ci.yml
│       ├── validate-copilot-instructions.yml
│       └── validate-yaml.yml
├── .governance
│   ├── LANGUAGE_DIMENSION_MAPPING.md
│   ├── README.md
│   ├── module-environment-matrix.yml
│   ├── policies.yaml
│   ├── registry.yaml
│   └── deployment
│       └── matechat-services.yml
├── .registry
│   ├── module-A.yaml
│   ├── module-contracts-l1.yaml
│   └── schema.json
├── .vscode
│   ├── extensions.json
│   ├── mcp.json
│   └── settings.json
├── _codeql_detected_source_root -> .
├── advanced-architecture
│   ├── .gitignore
│   ├── DeploymentGuide.txt
│   ├── FileDescription.txt
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── scripts
│   │   └── build.mjs
│   └── src
│       ├── App.tsx
│       ├── main.tsx
│       ├── shadcn.css
│       ├── components
│       │   ├── layout
│       │   │   ├── Footer.tsx
│       │   │   └── Navbar.tsx
│       │   └── ui
│       │       ├── accordion.tsx
│       │       ├── alert-dialog.tsx
│       │       ├── alert.tsx
│       │       ├── aspect-ratio.tsx
│       │       ├── avatar.tsx
│       │       ├── badge.tsx
│       │       ├── breadcrumb.tsx
│       │       ├── button.tsx
│       │       ├── calendar.tsx
│       │       ├── card.tsx
│       │       ├── carousel.tsx
│       │       ├── chart.tsx
│       │       ├── checkbox.tsx
│       │       ├── collapsible.tsx
│       │       ├── command.tsx
│       │       ├── context-menu.tsx
│       │       ├── dialog.tsx
│       │       ├── drawer.tsx
│       │       ├── dropdown-menu.tsx
│       │       ├── form.tsx
│       │       ├── hover-card.tsx
│       │       ├── input-otp.tsx
│       │       ├── input.tsx
│       │       ├── label.tsx
│       │       ├── menubar.tsx
│       │       ├── navigation-menu.tsx
│       │       ├── pagination.tsx
│       │       ├── popover.tsx
│       │       ├── progress.tsx
│       │       ├── radio-group.tsx
│       │       ├── resizable.tsx
│       │       ├── scroll-area.tsx
│       │       ├── select.tsx
│       │       ├── separator.tsx
│       │       ├── sheet.tsx
│       │       ├── sidebar.tsx
│       │       ├── skeleton.tsx
│       │       ├── slider.tsx
│       │       ├── sonner.tsx
│       │       ├── switch.tsx
│       │       ├── table.tsx
│       │       ├── tabs.tsx
│       │       ├── textarea.tsx
│       │       ├── toast.tsx
│       │       ├── toaster.tsx
│       │       ├── toggle-group.tsx
│       │       ├── toggle.tsx
│       │       └── tooltip.tsx
│       ├── hooks
│       │   ├── use-mobile.tsx
│       │   └── use-toast.ts
│       ├── lib
│       │   └── utils.ts
│       └── pages
│           ├── Architecture.tsx
│           ├── Backend.tsx
│           ├── Contact.tsx
│           ├── Frontend.tsx
│           └── Home.tsx
├── advanced-system-dist
│   ├── index.html
│   ├── main-BBH4KZVP.css
│   └── main-O4YYWX2Q.js
├── advanced-system-src
│   ├── .gitignore
│   ├── Dockerfile
│   ├── Dockerfile.api
│   ├── PHASE2_IMPROVEMENTS.md
│   ├── README.md
│   ├── docker-compose.api.yml
│   ├── index.html
│   ├── package.json
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   ├── .github
│   │   └── workflows
│   │       └── test-api.yml
│   ├── core
│   │   └── analyzers
│   │       └── analyzer.py
│   ├── deploy
│   │   ├── deployment.yaml
│   │   ├── hpa.yaml
│   │   ├── rbac.yaml
│   │   └── service.yaml
│   ├── k8s
│   │   └── deployment-api.yaml
│   ├── scripts
│   │   └── build.mjs
│   ├── services
│   │   ├── api.py
│   │   ├── code_analyzer.py
│   │   └── models.py
│   ├── src
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   ├── shadcn.css
│   │   ├── components
│   │   │   ├── layout
│   │   │   │   ├── Footer.tsx
│   │   │   │   └── Navbar.tsx
│   │   │   └── ui
│   │   │       ├── accordion.tsx
│   │   │       ├── alert-dialog.tsx
│   │   │       ├── alert.tsx
│   │   │       ├── aspect-ratio.tsx
│   │   │       ├── avatar.tsx
│   │   │       ├── badge.tsx
│   │   │       ├── breadcrumb.tsx
│   │   │       ├── button.tsx
│   │   │       ├── calendar.tsx
│   │   │       ├── card.tsx
│   │   │       ├── carousel.tsx
│   │   │       ├── chart.tsx
│   │   │       ├── checkbox.tsx
│   │   │       ├── collapsible.tsx
│   │   │       ├── command.tsx
│   │   │       ├── context-menu.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── drawer.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── form.tsx
│   │   │       ├── hover-card.tsx
│   │   │       ├── input-otp.tsx
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── menubar.tsx
│   │   │       ├── navigation-menu.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── popover.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── radio-group.tsx
│   │   │       ├── resizable.tsx
│   │   │       ├── scroll-area.tsx
│   │   │       ├── select.tsx
│   │   │       ├── separator.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── sidebar.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── slider.tsx
│   │   │       ├── sonner.tsx
│   │   │       ├── switch.tsx
│   │   │       ├── table.tsx
│   │   │       ├── tabs.tsx
│   │   │       ├── textarea.tsx
│   │   │       ├── toast.tsx
│   │   │       ├── toaster.tsx
│   │   │       ├── toggle-group.tsx
│   │   │       ├── toggle.tsx
│   │   │       └── tooltip.tsx
│   │   ├── hooks
│   │   │   ├── use-mobile.tsx
│   │   │   └── use-toast.ts
│   │   ├── lib
│   │   │   └── utils.ts
│   │   └── pages
│   │       ├── Architecture.tsx
│   │       ├── Backend.tsx
│   │       ├── Contact.tsx
│   │       ├── Frontend.tsx
│   │       └── Home.tsx
│   └── tests
│       ├── __init__.py
│       └── test_code_analyzer.py
├── agent
│   ├── runbook-executor.sh
│   ├── auto-repair
│   │   └── README.md
│   ├── code-analyzer
│   │   └── README.md
│   ├── orchestrator
│   │   └── README.md
│   └── vulnerability-detector
│       └── README.md
├── artifacts
│   └── reports
│       └── schema
│           ├── compliance.schema.json
│           └── sla.schema.json
├── attest-build-provenance-main
│   ├── .gitattributes
│   ├── .gitignore
│   ├── .markdown-lint.yml
│   ├── .node-version
│   ├── .prettierignore
│   ├── .prettierrc.json
│   ├── CODEOWNERS
│   ├── LICENSE
│   ├── README.md
│   ├── RELEASE.md
│   ├── action.yml
│   ├── eslint.config.mjs
│   ├── jest.setup.js
│   ├── package.json
│   ├── tsconfig.json
│   ├── tsconfig.lint.json
│   ├── .github
│   │   ├── dependabot.yml
│   │   └── workflows
│   │       ├── check-dist.yml
│   │       ├── ci.yml
│   │       ├── codeql-analysis.yml
│   │       ├── prober-github.yml
│   │       ├── prober-public-good.yml
│   │       └── prober.yml
│   ├── __tests__
│   │   ├── index.test.ts
│   │   ├── main.test.ts
│   │   └── __snapshots__
│   │       └── main.test.ts.snap
│   ├── predicate
│   │   └── action.yml
│   └── src
│       ├── index.ts
│       └── main.ts
├── audit
│   └── append-only-log-client.js
├── automation-architect
│   ├── Dockerfile
│   ├── README.md
│   ├── docker-compose.yml
│   ├── requirements.txt
│   ├── .github
│   │   └── workflows
│   │       └── ci.yml
│   ├── config
│   │   └── automation-architect.yml
│   ├── core
│   │   ├── __init__.py
│   │   ├── analysis
│   │   │   ├── __init__.py
│   │   │   ├── architecture_analyzer.py
│   │   │   ├── performance_analyzer.py
│   │   │   ├── security_scanner.py
│   │   │   └── static_analyzer.py
│   │   ├── orchestration
│   │   │   ├── __init__.py
│   │   │   ├── event_bus.py
│   │   │   └── pipeline.py
│   │   └── repair
│   │       ├── __init__.py
│   │       ├── ast_transformer.py
│   │       ├── repair_verifier.py
│   │       └── rule_engine.py
│   ├── docs
│   │   ├── API.md
│   │   ├── DEPLOYMENT.md
│   │   └── INTEGRATION_GUIDE.md
│   ├── examples
│   │   └── basic_usage.py
│   ├── frameworks
│   │   └── popular
│   │       └── README.md
│   ├── scenarios
│   │   ├── automation-iteration
│   │   │   └── README.md
│   │   ├── autonomous-driving
│   │   │   └── README.md
│   │   └── drone-systems
│   │       └── README.md
│   └── tests
│       ├── __init__.py
│       └── unit
│           ├── test_security_scanner.py
│           └── test_static_analyzer.py
├── autonomous-system
│   ├── INTEGRATION_SUMMARY.md
│   ├── README.md
│   ├── api-governance
│   │   ├── README.md
│   │   ├── api_contract.py
│   │   └── requirements.txt
│   ├── architecture-stability
│   │   ├── CMakeLists.txt
│   │   ├── README.md
│   │   ├── flight_controller.cpp
│   │   └── package.xml
│   ├── docs-examples
│   │   ├── API_DOCUMENTATION.md
│   │   ├── QUICKSTART.md
│   │   ├── README.md
│   │   └── governance_matrix.yaml
│   ├── security-observability
│   │   ├── README.md
│   │   ├── go.mod
│   │   ├── main.go
│   │   └── observability
│   │       └── event_logger.go
│   └── testing-compatibility
│       ├── README.md
│       ├── requirements.txt
│       ├── test_compatibility.py
│       └── test_config.yaml
├── canary
│   └── policy-sim-plan.yaml
├── ci
│   ├── contract-checker.js
│   ├── language-checker.js
│   └── policy-simulate.yml
├── config
│   ├── elasticsearch-config.sh
│   ├── grafana-dashboard.json
│   ├── peachy-build.toml
│   ├── prometheus-config.yml
│   ├── prometheus-rules.yml
│   ├── security-network-config.yml
│   └── integrations
│       ├── README.md
│       ├── jira-integration.py
│       ├── slack-webhook.sh
│       └── matechat
│           └── config.yaml
├── contracts
│   └── external-api.json
├── core
│   └── contracts
│       └── contracts-L1
│           ├── ai-chat-service
│           │   ├── .env.example
│           │   ├── README.md
│           │   ├── package-lock.json
│           │   ├── package.json
│           │   ├── tsconfig.json
│           │   └── src
│           └── contracts
│               ├── .dockerignore
│               ├── .env.example
│               ├── .eslintrc.json
│               ├── .gitignore
│               ├── BUILD_PROVENANCE.md
│               ├── Dockerfile
│               ├── SLSA_INTEGRATION_REPORT.md
│               ├── jest.config.js
│               ├── package-lock.json
│               ├── package.json
│               ├── tailwind.config.js
│               ├── tsconfig.json
│               ├── web-package.json
│               ├── ci
│               ├── contracts
│               ├── deploy
│               ├── docs
│               ├── policy
│               ├── public
│               ├── sbom
│               ├── scripts
│               ├── src
│               └── web
├── docs
│   ├── AUTO_ASSIGNMENT_API.md
│   ├── AUTO_ASSIGNMENT_DEMO.md
│   ├── AUTO_ASSIGNMENT_SUMMARY.md
│   ├── AUTO_ASSIGNMENT_SYSTEM.md
│   ├── AUTO_FIX_BOT_V2_GUIDE.md
│   ├── AUTO_MERGE.md
│   ├── AUTO_REVIEW_MERGE.md
│   ├── CI_AUTO_COMMENT_SYSTEM.md
│   ├── CLOUD_DELEGATION.md
│   ├── CODEQL_SETUP.md
│   ├── CODESPACE_SETUP.md
│   ├── COPILOT_SETUP.md
│   ├── DEPLOYMENT_ASSESSMENT.md
│   ├── DISASTER_RECOVERY.md
│   ├── DYNAMIC_CI_ASSISTANT.md
│   ├── EFFICIENCY_METRICS.md
│   ├── EXAMPLES.md
│   ├── GHAS_COMPLETE_GUIDE.md
│   ├── GHAS_DEPLOYMENT.md
│   ├── INTEGRATION_GUIDE.md
│   ├── INTELLIGENT_AUTOMATION_INTEGRATION.md
│   ├── INTERACTIVE_CI_UPGRADE_GUIDE.md
│   ├── MATECHAT_INTEGRATION_SUMMARY.md
│   ├── MERGE_BLOCKED_FIX.md
│   ├── QUICK_START.md
│   ├── README.md
│   ├── SECRET_SCANNING.md
│   ├── SECURITY_TRAINING.md
│   ├── TIER1_CONTRACTS_L1_DEPLOYMENT_PLAN.md
│   ├── VISUAL_ELEMENTS.md
│   ├── VULNERABILITY_MANAGEMENT.md
│   ├── architecture.zh.md
│   ├── ci-troubleshooting.md
│   ├── deep-integration-guide.zh.md
│   ├── production-deployment-guide.zh.md
│   ├── runbook.zh.md
│   ├── architecture
│   │   ├── CODE_QUALITY_CHECKS.md
│   │   ├── DEPLOYMENT_INFRASTRUCTURE.md
│   │   ├── FILE_MANIFEST.txt
│   │   ├── README.md
│   │   ├── SECURITY_CONFIG_CHECKS.md
│   │   ├── SYSTEM_ARCHITECTURE.md
│   │   ├── matechat-integration.md
│   │   └── configuration
│   │       ├── .eslintrc.example.js
│   │       ├── .prettierrc.example.json
│   │       ├── README.md
│   │       ├── sonar-project.properties.example
│   │       ├── docker
│   │       │   ├── Dockerfile.code-checker
│   │       │   └── docker-compose.yml
│   │       ├── jenkins
│   │       │   └── Jenkinsfile.code-quality
│   │       ├── kubernetes
│   │       │   └── k8s-sonarqube.yaml
│   │       ├── monitoring
│   │       │   └── prometheus-config.yaml
│   │       ├── python
│   │       │   ├── config_validator.py
│   │       │   └── security_scanner.py
│   │       └── scripts
│   │           ├── config-check.sh
│   │           ├── format-check.sh
│   │           ├── phase2-security-check.sh
│   │           └── security-scan.sh
│   └── ci-cd
│       ├── IMPLEMENTATION_SUMMARY.md
│       ├── README.md
│       └── stage-1-basic-ci.md
├── drift
│   ├── rules.yaml
│   └── scan-cronjob.yaml
├── governance
│   └── language-policy.yml
├── intelligent-automation
│   ├── AUTO_UPGRADE.md
│   ├── README.md
│   ├── __init__.py
│   ├── auto_upgrade_env.py
│   ├── pipeline_service.py
│   ├── requirements.txt
│   ├── agents
│   │   ├── __init__.py
│   │   ├── recognition_server.py
│   │   ├── task_executor.py
│   │   └── visualization_agent.py
│   ├── examples
│   │   └── demo.py
│   └── tests
│       ├── __init__.py
│       └── test_task_executor.py
├── intelligent-hyperautomation
│   ├── CHANGELOG.md
│   ├── QUICK_REFERENCE.md
│   ├── README.md
│   ├── contracts
│   │   └── file-contract.json
│   ├── docs
│   │   ├── ci-cd-strategy.md
│   │   ├── core-principles.md
│   │   ├── sbom-placeholder.json
│   │   ├── uav-autonomous-driving-governance.md
│   │   └── usage-notes.md
│   ├── policies
│   │   ├── gatekeeper
│   │   │   ├── geo-fencing.yaml
│   │   │   └── uav-ad-labels.yaml
│   │   └── rego
│   │       └── uav_ad.rego
│   └── templates
│       └── impl
│           └── examples
│               ├── README.md
│               ├── ad-deployment.yaml
│               ├── namespace.yaml
│               ├── uav-configmap.yaml
│               └── uav-deployment.yaml
├── k8s
│   ├── README.md
│   ├── configmap.yaml
│   ├── hpa.yaml
│   ├── kustomization.yaml
│   ├── namespace.yaml
│   ├── secrets.yaml
│   ├── cache
│   │   ├── redis-service.yaml
│   │   └── redis-statefulset.yaml
│   ├── database
│   │   ├── postgres-service.yaml
│   │   └── postgres-statefulset.yaml
│   ├── hpa
│   │   ├── hpa.yaml
│   │   └── vpa.yaml
│   ├── ingress
│   │   ├── cert-manager.yaml
│   │   └── ingress.yaml
│   ├── monitoring
│   │   ├── grafana-deployment.yaml
│   │   ├── jaeger-deployment.yaml
│   │   ├── loki-deployment.yaml
│   │   ├── monitoring-services.yaml
│   │   └── prometheus-deployment.yaml
│   ├── network-policies
│   │   └── network-policy.yaml
│   ├── overlays
│   │   ├── dev
│   │   │   └── kustomization.yaml
│   │   ├── prod
│   │   │   └── kustomization.yaml
│   │   └── staging
│   │       └── kustomization.yaml
│   ├── phase2
│   │   ├── IMPLEMENTATION_SUMMARY.md
│   │   ├── README.md
│   │   ├── kustomization.yaml
│   │   ├── 01-namespace-rbac
│   │   │   ├── namespace.yaml
│   │   │   ├── network-policies.yaml
│   │   │   ├── pod-security-policies.yaml
│   │   │   └── rbac.yaml
│   │   ├── 02-storage
│   │   │   ├── persistent-volume-claims.yaml
│   │   │   └── storage-classes.yaml
│   │   ├── 03-secrets-config
│   │   │   ├── configmaps.yaml
│   │   │   └── secrets.yaml
│   │   ├── 04-databases
│   │   │   ├── postgres
│   │   │   │   ├── backup-cronjob.yaml
│   │   │   │   ├── monitoring.yaml
│   │   │   │   ├── service.yaml
│   │   │   │   └── statefulset.yaml
│   │   │   └── redis
│   │   │       ├── monitoring.yaml
│   │   │       ├── service.yaml
│   │   │       └── statefulset.yaml
│   │   ├── 05-core-services
│   │   │   ├── auto-repair
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── hpa.yaml
│   │   │   │   ├── network-policy.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── code-analyzer
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── hpa.yaml
│   │   │   │   ├── network-policy.yaml
│   │   │   │   ├── pdb.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── contracts-l1
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── hpa.yaml
│   │   │   │   ├── network-policy.yaml
│   │   │   │   ├── pdb.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── orchestrator
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── network-policy.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── result-aggregator
│   │   │   │   ├── deployment.yaml
│   │   │   │   ├── network-policy.yaml
│   │   │   │   └── service.yaml
│   │   │   └── vulnerability-detector
│   │   │       ├── deployment.yaml
│   │   │       ├── hpa.yaml
│   │   │       ├── network-policy.yaml
│   │   │       └── service.yaml
│   │   ├── 06-monitoring
│   │   │   ├── alertmanager
│   │   │   │   ├── configmap.yaml
│   │   │   │   ├── deployment.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── grafana
│   │   │   │   ├── configmap.yaml
│   │   │   │   ├── deployment.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── jaeger
│   │   │   │   ├── deployment.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── loki
│   │   │   │   ├── configmap.yaml
│   │   │   │   ├── deployment.yaml
│   │   │   │   └── service.yaml
│   │   │   ├── node-exporter
│   │   │   │   ├── daemonset.yaml
│   │   │   │   └── service.yaml
│   │   │   └── prometheus
│   │   │       ├── configmap.yaml
│   │   │       ├── deployment.yaml
│   │   │       └── service.yaml
│   │   ├── 07-logging
│   │   │   └── fluent-bit
│   │   │       ├── configmap.yaml
│   │   │       ├── daemonset.yaml
│   │   │       └── rbac.yaml
│   │   ├── 08-ingress-gateway
│   │   │   ├── ingress-controller.yaml
│   │   │   └── ingress-rules.yaml
│   │   ├── 09-backup-recovery
│   │   │   └── velero-backup.yaml
│   │   ├── 10-testing
│   │   │   └── performance-tests.yaml
│   │   ├── 11-ci-cd
│   │   │   └── argocd-deployment.yaml
│   │   ├── 12-security
│   │   │   ├── falco-deployment.yaml
│   │   │   └── trivy-scanner.yaml
│   │   └── overlays
│   │       ├── dev
│   │       │   └── kustomization.yaml
│   │       ├── prod
│   │       │   └── kustomization.yaml
│   │       └── staging
│   │           └── kustomization.yaml
│   ├── rbac
│   │   ├── role.yaml
│   │   ├── rolebinding.yaml
│   │   └── serviceaccount.yaml
│   ├── services
│   │   ├── auto-repair-deployment.yaml
│   │   ├── code-analyzer-deployment.yaml
│   │   ├── orchestrator-deployment.yaml
│   │   ├── services.yaml
│   │   └── vulnerability-detector-deployment.yaml
│   └── storage
│       ├── pvc.yaml
│       └── storageclass.yaml
├── mcp-servers
│   ├── .eslintrc.json
│   ├── .gitignore
│   ├── Dockerfile
│   ├── README.md
│   ├── VALIDATION.md
│   ├── code-analyzer.js
│   ├── comprehensive-validator.js
│   ├── deployment-validator.js
│   ├── doc-generator.js
│   ├── index.js
│   ├── logic-validator.js
│   ├── package.json
│   ├── performance-analyzer.js
│   ├── security-scanner.js
│   ├── slsa-validator.js
│   ├── test-generator.js
│   └── deploy
│       ├── deployment.yaml
│       ├── hpa.yaml
│       ├── pdb.yaml
│       ├── rbac.yaml
│       └── service.yaml
├── monitoring
│   ├── grafana-dashboard.json
│   ├── prometheus.yml
│   └── alerts
│       └── service-alerts.yml
├── onboarding
│   └── pr-template.md
├── performance-tests
│   ├── benchmark.js
│   └── load-test.js
├── policy
│   └── manifest-policies.rego
├── reports
│   └── language-compliance.json
├── runbooks
│   └── ng-degrade.json
├── sbom
│   └── signing-policy.yml
├── schemas
│   ├── .auto-fix-bot.schema.json
│   ├── auto-fix-bot-v2.schema.json
│   ├── cloud-agent-delegation.schema.json
│   ├── code-analysis.schema.json
│   ├── repair.schema.json
│   └── vulnerability.schema.json
├── scripts
│   ├── README.md
│   ├── advanced-push-protection.sh
│   ├── analyze.sh
│   ├── build-matrix.sh
│   ├── check-env.sh
│   ├── conditional-deploy.sh
│   ├── generate-directory-tree.sh
│   ├── manage-secret-patterns.py
│   ├── repair.sh
│   ├── setup.sh
│   ├── validate_auto_fix_bot_config.py
│   ├── vulnerability-alert-handler.py
│   ├── artifacts
│   │   └── build.sh
│   ├── backup
│   │   ├── backup.sh
│   │   └── restore.sh
│   └── naming
│       ├── check-naming.sh
│       ├── language-checker.mjs
│       └── suggest-name.mjs
├── test-vectors
│   ├── vectors-manifest.yaml
│   ├── auto-fix-bot
│   │   ├── invalid_bad_threshold.json
│   │   └── valid_minimal.json
│   └── cloud-agent-delegation
│       ├── invalid_bad_weights.json
│       ├── invalid_missing_provider.json
│       ├── valid_full.json
│       └── valid_minimal.json
└── tools
    ├── validate_vectors.py
    └── validate_yaml.py

201 directories, 652 files
```

## 📋 特殊目錄說明 / Special Directories

以下為特殊目錄及其用途說明：

- **`.git/`**: Git 版本控制目錄 / Git version control directory
- **`.github/`**: GitHub 設定與工作流程 / GitHub configuration and workflows
  ```
  CODEOWNERS
  FUNDING.yml
  agents
  auto-review-config.yml
  codeql
  copilot-instructions.md
  dependabot.yml
  scripts
  secret-scanning
  security-policy.yml
  ... (共 11 個項目 / Total 11 items)
  ```
- **`.vscode/`**: VS Code 編輯器設定 / VS Code editor configuration
  ```
  extensions.json
  mcp.json
  settings.json
  ```
- **`.devcontainer/`**: 開發容器設定 / Development container configuration
  ```
  CHANGELOG.md
  Dockerfile
  KB.md
  QUICK_START.md
  README.md
  SOLUTION_SUMMARY.md
  TEST-GUIDE.md
  devcontainer.json
  docker-compose.dev.yml
  docker-compose.yml
  ... (共 18 個項目 / Total 18 items)
  ```
- **`.config/`**: 專案設定檔案 / Project configuration files
  ```
  conftest
  ```
- **`.autofix/`**: 自動修復機制設定 / Auto-fix mechanism configuration
  ```
  config.json
  rules
  ```
- **`.governance/`**: 治理規則與政策 / Governance rules and policies
  ```
  LANGUAGE_DIMENSION_MAPPING.md
  README.md
  deployment
  module-environment-matrix.yml
  policies.yaml
  registry.yaml
  ```
- **`.registry/`**: 註冊表設定 / Registry configuration
  ```
  module-A.yaml
  module-contracts-l1.yaml
  schema.json
  ```
- **`.docker-templates/`**: Docker 範本檔案 / Docker template files
  ```
  NODEJS_USER_SETUP.md
  validate-dockerfiles.sh
  ```
- **`node_modules/`**: Node.js 依賴套件（已排除顯示）/ Node.js dependencies (excluded from display)

## 📊 專案統計 / Project Statistics

- **總檔案數 / Total files**: 828
- **總目錄數 / Total directories**: 222

### 檔案類型分布 / File Type Distribution

| 檔案類型 / File Type | 數量 / Count |
|---------------------|--------------|
| .tsx               |          227 |
| .yaml              |          149 |
| .md                |          127 |
| .yml               |           74 |
| .json              |           52 |
| .py                |           43 |
| .ts                |           36 |
| .sh                |           27 |
| .js                |           24 |
| .txt               |           12 |
| .mjs               |            7 |
| .gitignore         |            6 |
| .rego              |            5 |
| .html              |            5 |
| .css               |            5 |

### 最大的目錄 / Largest Directories (排除 node_modules)

| 目錄 / Directory | 檔案數 / File Count |
|-----------------|---------------------|
| `./core/contracts/contracts-L1/contracts/web/src/components/ui` |                  48 |
| `./core/contracts/contracts-L1/contracts/web/components/ui` |                  48 |
| `./advanced-system-src/src/components/ui` |                  48 |
| `./advanced-architecture/src/components/ui` |                  48 |
| `./docs`                       |                  36 |
| `.`                            |                  31 |
| `./.github/workflows`          |                  30 |
| `./.devcontainer`              |                  18 |
| `./mcp-servers`                |                  16 |
| `./attest-build-provenance-main` |                  16 |

## 🔍 目錄用途說明 / Directory Purpose Description

- **`advanced-architecture/`**: 進階架構 / Advanced architecture
- **`advanced-system-dist/`**: 進階系統編譯產出 / Advanced system distribution
- **`advanced-system-src/`**: 進階系統源碼 / Advanced system source code
- **`agent/`**: 代理程式 / Agent programs
- **`artifacts/`**: 建置產物 / Build artifacts
- **`attest-build-provenance-main/`**: 建置認證主程式 / Build attestation main program
- **`audit/`**: 稽核記錄 / Audit logs
- **`automation-architect/`**: 自動化架構 / Automation architecture
- **`autonomous-system/`**: 自主系統 / Autonomous system
- **`config/`**: 設定檔案 / Configuration files
- **`contracts/`**: 合約定義 / Contract definitions
- **`core/`**: 核心平台服務 / Core platform services
- **`docs/`**: 文件資料 / Documentation
- **`governance/`**: 治理規則 / Governance rules
- **`intelligent-automation/`**: 智能自動化 / Intelligent automation
- **`intelligent-hyperautomation/`**: 智能超自動化 / Intelligent hyperautomation
- **`k8s/`**: Kubernetes 部署設定 / Kubernetes deployment configuration
- **`mcp-servers/`**: MCP 伺服器實作 / MCP server implementations
- **`monitoring/`**: 監控設定 / Monitoring configuration
- **`policy/`**: 政策定義 / Policy definitions
- **`reports/`**: 報告產出 / Report outputs
- **`runbooks/`**: 運維手冊 / Operational runbooks
- **`sbom/`**: 軟體物料清單 / Software Bill of Materials
- **`schemas/`**: 資料結構定義 / Schema definitions
- **`scripts/`**: 自動化腳本 / Automation scripts
- **`test-vectors/`**: 測試向量 / Test vectors
- **`tools/`**: 工具程式 / Utility tools

---

> 💡 **注意 / Note**: 此目錄結構圖譜已排除 `node_modules`, `.git`, `dist`, `build` 等目錄以提高可讀性。
> 若需查看完整結構（包含所有目錄），請執行：
> ```bash
> tree -a -L 5
> # 或 / or
> find . | sed 's,[^/]*/,  ,g'
> ```

---

**產生腳本 / Generated by**: `scripts/generate-directory-tree.sh`  
**專案 / Project**: SLASolve  
**儲存庫 / Repository**: [we-can-fix/slasolve](https://github.com/we-can-fix/slasolve)
