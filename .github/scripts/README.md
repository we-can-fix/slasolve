# GitHub CI Scripts

此目錄包含自動駕駛級 CI 守護者系統的輔助腳本 (This directory contains helper scripts for the Autonomous CI Guardian system).

## 📁 Scripts

### `predict_failures.py`

ML-based failure prediction module that analyzes git commit history to predict potential CI/CD failures.

**功能特點 (Features):**
- 分析 commit 歷史中的故障模式 (Analyzes failure patterns in commit history)
- 計算風險分數 (Calculates risk scores)
- 識別高風險區域 (Identifies high-risk areas)
- 支持多種故障類別：Docker、測試、性能、安全、記憶體 (Supports multiple failure categories)

**使用方式 (Usage):**

```bash
# Run prediction on current repository
python3 predict_failures.py

# Output (JSON format)
{
  "patterns": {
    "docker": 3,
    "test": 5,
    "performance": 2,
    "security": 1,
    "memory": 0
  },
  "risk_score": 0.45,
  "high_risk_areas": ["test"]
}
```

**模組結構 (Module Structure):**

- `FailurePatterns`: 故障模式資料類別 (Dataclass for failure pattern counts)
- `PredictionResult`: 預測結果資料類別 (Dataclass for prediction results)
- `FailurePredictor`: 主預測器類別 (Main predictor class)
  - `get_commit_history()`: 獲取 Git 歷史 (Fetch git history)
  - `analyze_patterns()`: 分析模式 (Analyze patterns)
  - `calculate_risk_score()`: 計算風險 (Calculate risk)
  - `identify_high_risk_areas()`: 識別高風險 (Identify high-risk areas)
  - `predict()`: 執行完整預測 (Execute full prediction)

## 🧪 Testing

The module has comprehensive unit test coverage (99%+) with tests for:

- ✅ Pattern detection (Docker, Test, Performance, Security, Memory)
- ✅ Risk score calculation
- ✅ High-risk area identification
- ✅ Edge cases (empty commits, special characters)
- ✅ Various commit history scenarios
- ✅ Integration workflows

**運行測試 (Run Tests):**

```bash
cd .github/scripts

# Install dependencies
pip install pytest pytest-cov

# Run all tests
pytest tests/ -v

# Run with coverage report
pytest tests/ -v --cov=. --cov-report=term-missing

# Run specific test class
pytest tests/test_predict_failures.py::TestFailurePredictor -v
```

**測試結構 (Test Structure):**

```
.github/scripts/
├── predict_failures.py       # Main module
├── pytest.ini                # Pytest configuration
├── tests/
│   ├── __init__.py
│   └── test_predict_failures.py  # Comprehensive tests
└── README.md                 # This file
```

## 📊 Coverage Report

Current test coverage: **99.69%**

```
Name                             Stmts   Miss  Cover   Missing
--------------------------------------------------------------
predict_failures.py                 60      1    98%   197
tests/__init__.py                    0      0   100%
tests/test_predict_failures.py     260      0   100%
--------------------------------------------------------------
TOTAL                              320      1    99%
```

## 🔧 Configuration

The prediction logic uses the following thresholds:

- **Fetch Depth**: 50 commits (configurable)
- **High Risk Threshold**: 5+ occurrences
- **Pattern Keywords**:
  - Docker: `docker`, `compose`, `image`, `container`
  - Test: `test`, `spec`, `unit`, `integration`
  - Performance: `perf`, `optimize`, `speed`, `performance`
  - Security: `security`, `auth`, `encrypt`, `vulnerability`
  - Memory: `memory`, `leak`, `gc`, `heap`

## 🚀 Integration

The module is integrated into the Autonomous CI Guardian workflow:

```yaml
- name: 🧠 ML failure prediction
  id: ml-predict
  run: |
    python3 .github/scripts/predict_failures.py > prediction.json
    PREDICTIONS=$(cat prediction.json | jq -c '.')
    echo "failures=$PREDICTIONS" >> "$GITHUB_OUTPUT"
```

## 📝 Development

When modifying the prediction logic:

1. **Update the module**: Edit `predict_failures.py`
2. **Update tests**: Ensure tests cover new functionality
3. **Run tests**: Verify all tests pass with adequate coverage
4. **Update documentation**: Keep this README in sync

**程式碼風格 (Code Style):**
- 遵循 PEP 8 規範 (Follow PEP 8)
- 使用 type hints
- 包含 docstrings (中英雙語)
- 測試覆蓋率 ≥ 80%

## 🔍 Troubleshooting

**問題：Git 命令失敗 (Issue: Git command fails)**
```bash
# Solution: Ensure git is installed and repository is initialized
git --version
git log --oneline -1
```

**問題：測試失敗 (Issue: Tests fail)**
```bash
# Solution: Install required dependencies
pip install pytest pytest-cov

# Run tests with verbose output
pytest tests/ -vv
```

**問題：導入錯誤 (Issue: Import errors)**
```bash
# Solution: Run from correct directory
cd .github/scripts
python3 -m pytest tests/
```

## 📚 References

- [SLSA Framework](https://slsa.dev/)
- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Pytest Documentation](https://docs.pytest.org/)

---

**Last Updated**: 2025-11-26  
**Maintainer**: SLASolve Team
