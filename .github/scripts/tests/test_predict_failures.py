#!/usr/bin/env python3
"""
Unit tests for ML-based failure prediction.

測試自動駕駛級 CI 守護者的故障預測邏輯。

Tests cover various scenarios including:
- No matching patterns
- High-risk scenarios
- Mixed patterns
- Edge cases (empty commits, special characters)
- Risk score calculation accuracy
"""

import json
import subprocess
from unittest.mock import Mock, patch

import pytest

from predict_failures import (
    FailurePatterns,
    FailurePredictor,
    PredictionResult,
)


class TestFailurePatterns:
    """Test FailurePatterns dataclass."""

    def test_default_values(self):
        """測試預設值 (Test default initialization values)."""
        patterns = FailurePatterns()
        assert patterns.docker == 0
        assert patterns.test == 0
        assert patterns.performance == 0
        assert patterns.security == 0
        assert patterns.memory == 0

    def test_custom_values(self):
        """Test custom initialization values."""
        patterns = FailurePatterns(
            docker=3,
            test=5,
            performance=2,
            security=1,
            memory=4,
        )
        assert patterns.docker == 3
        assert patterns.test == 5
        assert patterns.performance == 2
        assert patterns.security == 1
        assert patterns.memory == 4

    def test_to_dict(self):
        """Test conversion to dictionary."""
        patterns = FailurePatterns(docker=2, test=3)
        result = patterns.to_dict()
        
        assert isinstance(result, dict)
        assert result['docker'] == 2
        assert result['test'] == 3
        assert result['performance'] == 0
        assert result['security'] == 0
        assert result['memory'] == 0


class TestPredictionResult:
    """Test PredictionResult dataclass."""

    def test_to_dict(self):
        """Test conversion to dictionary with nested patterns."""
        patterns = FailurePatterns(docker=5, security=3)
        result = PredictionResult(
            patterns=patterns,
            risk_score=0.625,
            high_risk_areas=['docker'],
        )
        
        output = result.to_dict()
        
        assert output['risk_score'] == 0.625
        assert output['high_risk_areas'] == ['docker']
        assert output['patterns']['docker'] == 5
        assert output['patterns']['security'] == 3


class TestFailurePredictor:
    """Test FailurePredictor class."""

    def test_initialization(self):
        """測試初始化 (Test predictor initialization)."""
        predictor = FailurePredictor(fetch_depth=30)
        assert predictor.fetch_depth == 30

    def test_default_fetch_depth(self):
        """Test default fetch depth."""
        predictor = FailurePredictor()
        assert predictor.fetch_depth == 50

    @patch('predict_failures.subprocess.run')
    def test_get_commit_history_success(self, mock_run):
        """Test successful commit history retrieval."""
        mock_result = Mock()
        mock_result.stdout = (
            'abc123 feat: add docker support\n'
            'def456 fix: memory leak in test\n'
            'ghi789 perf: optimize security check\n'
        )
        mock_run.return_value = mock_result
        
        predictor = FailurePredictor()
        commits = predictor.get_commit_history()
        
        assert len(commits) == 3
        assert commits[0] == 'abc123 feat: add docker support'
        assert commits[1] == 'def456 fix: memory leak in test'
        assert commits[2] == 'ghi789 perf: optimize security check'
        
        mock_run.assert_called_once_with(
            ['git', 'log', '--oneline', '-50'],
            capture_output=True,
            text=True,
            check=True,
        )

    @patch('predict_failures.subprocess.run')
    def test_get_commit_history_empty(self, mock_run):
        """測試空 commit 歷史 (Test empty commit history)."""
        mock_result = Mock()
        mock_result.stdout = ''
        mock_run.return_value = mock_result
        
        predictor = FailurePredictor()
        commits = predictor.get_commit_history()
        
        assert commits == []

    @patch('predict_failures.subprocess.run')
    def test_get_commit_history_git_error(self, mock_run):
        """Test git command failure."""
        mock_run.side_effect = subprocess.CalledProcessError(1, 'git')
        
        predictor = FailurePredictor()
        
        with pytest.raises(subprocess.CalledProcessError):
            predictor.get_commit_history()

    def test_analyze_patterns_no_matches(self):
        """Test pattern analysis with no matching keywords."""
        commits = [
            'abc123 feat: add new feature',
            'def456 chore: update readme',
            'ghi789 refactor: clean code',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.docker == 0
        assert patterns.test == 0
        assert patterns.performance == 0
        assert patterns.security == 0
        assert patterns.memory == 0

    def test_analyze_patterns_docker(self):
        """Test detection of docker-related patterns."""
        commits = [
            'abc123 feat: add docker-compose configuration',
            'def456 fix: container image build issue',
            'ghi789 chore: update Docker base image',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.docker == 3
        assert patterns.test == 0

    def test_analyze_patterns_test(self):
        """Test detection of test-related patterns."""
        commits = [
            'abc123 test: add unit tests for API',
            'def456 fix: integration test failure',
            'ghi789 test: add spec for user module',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.test == 3
        assert patterns.docker == 0

    def test_analyze_patterns_performance(self):
        """Test detection of performance-related patterns."""
        commits = [
            'abc123 perf: optimize database queries',
            'def456 perf: improve API speed',
            'ghi789 feat: enhance performance monitoring',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.performance == 3

    def test_analyze_patterns_security(self):
        """Test detection of security-related patterns."""
        commits = [
            'abc123 security: fix authentication bypass',
            'def456 feat: add encryption for sensitive data',
            'ghi789 security: patch vulnerability CVE-2024-1234',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.security == 3

    def test_analyze_patterns_memory(self):
        """Test detection of memory-related patterns."""
        commits = [
            'abc123 fix: memory leak in cache',
            'def456 fix: optimize heap allocation',
            'ghi789 fix: gc pause issue',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        # 'memory' in commit 1, 'heap' in commit 2, 'gc' in commit 3
        assert patterns.memory == 3

    def test_analyze_patterns_mixed(self):
        """測試混合模式 (Test mixed pattern detection)."""
        commits = [
            'abc123 feat: add docker support with tests',
            'def456 fix: memory leak in security module',
            'ghi789 test: optimize performance',
            'jkl012 chore: update documentation',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        # 'docker' in commit 1
        assert patterns.docker == 1
        # 'tests' in commit 1, 'test' in commit 3
        assert patterns.test == 2
        # 'memory' in commit 2
        assert patterns.memory == 1
        # 'security' in commit 2
        assert patterns.security == 1
        # 'performance' in commit 3
        assert patterns.performance == 1

    def test_analyze_patterns_case_insensitive(self):
        """Test case-insensitive pattern matching."""
        commits = [
            'abc123 feat: add DOCKER support',
            'def456 fix: Test failure',
            'ghi789 SECURITY: patch vulnerability',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.docker == 1
        assert patterns.test == 1
        assert patterns.security == 1

    def test_analyze_patterns_special_characters(self):
        """測試特殊字元 (Test handling of special characters)."""
        commits = [
            'abc123 feat: add docker-compose [WIP]',
            'def456 fix: test failure (critical!!!)',
            'ghi789 security: fix vuln. #1234',
            'jkl012 perf: optimize 🚀',
        ]
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.docker == 1
        assert patterns.test == 1
        assert patterns.security == 1
        assert patterns.performance == 1

    def test_analyze_patterns_empty_commits(self):
        """Test with empty commit list."""
        commits = []
        
        predictor = FailurePredictor()
        patterns = predictor.analyze_patterns(commits)
        
        assert patterns.docker == 0
        assert patterns.test == 0
        assert patterns.performance == 0
        assert patterns.security == 0
        assert patterns.memory == 0

    def test_calculate_risk_score_single_pattern(self):
        """Test risk score calculation with single dominant pattern."""
        patterns = FailurePatterns(docker=10, test=0, performance=0)
        
        predictor = FailurePredictor()
        risk_score = predictor.calculate_risk_score(patterns)
        
        # 10/10 = 1.0
        assert risk_score == 1.0

    def test_calculate_risk_score_balanced(self):
        """Test risk score with balanced patterns."""
        patterns = FailurePatterns(
            docker=2,
            test=2,
            performance=2,
            security=2,
            memory=2,
        )
        
        predictor = FailurePredictor()
        risk_score = predictor.calculate_risk_score(patterns)
        
        # 2/10 = 0.2
        assert risk_score == 0.2

    def test_calculate_risk_score_high_risk(self):
        """測試高風險場景 (Test high-risk scenario)."""
        patterns = FailurePatterns(
            docker=8,
            test=1,
            performance=1,
            security=0,
            memory=0,
        )
        
        predictor = FailurePredictor()
        risk_score = predictor.calculate_risk_score(patterns)
        
        # 8/10 = 0.8
        assert risk_score == 0.8

    def test_calculate_risk_score_zero_patterns(self):
        """Test risk score with no patterns (division by zero protection)."""
        patterns = FailurePatterns()
        
        predictor = FailurePredictor()
        risk_score = predictor.calculate_risk_score(patterns)
        
        # 0/1 = 0.0 (protected against division by zero)
        assert risk_score == 0.0

    def test_identify_high_risk_areas_none(self):
        """Test with no high-risk areas."""
        patterns = FailurePatterns(docker=2, test=3, performance=1)
        
        predictor = FailurePredictor()
        high_risk = predictor.identify_high_risk_areas(patterns)
        
        assert high_risk == []

    def test_identify_high_risk_areas_single(self):
        """Test with single high-risk area."""
        patterns = FailurePatterns(docker=8, test=2, performance=1)
        
        predictor = FailurePredictor()
        high_risk = predictor.identify_high_risk_areas(patterns)
        
        assert high_risk == ['docker']

    def test_identify_high_risk_areas_multiple(self):
        """測試多個高風險區域 (Test multiple high-risk areas)."""
        patterns = FailurePatterns(
            docker=6,
            test=7,
            performance=2,
            security=8,
            memory=1,
        )
        
        predictor = FailurePredictor()
        high_risk = predictor.identify_high_risk_areas(patterns)
        
        # Areas with count > 5
        assert set(high_risk) == {'docker', 'test', 'security'}

    def test_identify_high_risk_areas_threshold_boundary(self):
        """Test boundary condition at HIGH_RISK_THRESHOLD."""
        patterns = FailurePatterns(
            docker=5,  # Exactly at threshold
            test=6,    # Above threshold
            performance=4,  # Below threshold
        )
        
        predictor = FailurePredictor()
        high_risk = predictor.identify_high_risk_areas(patterns)
        
        # Only test should be high-risk (> 5)
        assert high_risk == ['test']

    @patch('predict_failures.subprocess.run')
    def test_predict_full_workflow(self, mock_run):
        """Test complete prediction workflow."""
        mock_result = Mock()
        mock_result.stdout = (
            'abc123 feat: add docker support\n'
            'def456 fix: docker compose issue\n'
            'ghi789 test: add unit tests\n'
            'jkl012 perf: optimize performance\n'
        )
        mock_run.return_value = mock_result
        
        predictor = FailurePredictor()
        result = predictor.predict()
        
        assert isinstance(result, PredictionResult)
        assert isinstance(result.patterns, FailurePatterns)
        assert result.patterns.docker == 2
        assert result.patterns.test == 1
        assert result.patterns.performance == 1
        assert isinstance(result.risk_score, float)
        assert 0.0 <= result.risk_score <= 1.0
        assert isinstance(result.high_risk_areas, list)

    def test_predict_with_provided_commits(self):
        """Test prediction with manually provided commits."""
        commits = [
            'abc123 security: critical vulnerability fix',
            'def456 security: patch authentication',
            'ghi789 security: update encryption',
            'jkl012 security: fix authorization',
            'mno345 security: security audit fixes',
            'pqr678 security: CVE-2024-1234 patch',
        ]
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        assert result.patterns.security == 6
        assert 'security' in result.high_risk_areas
        assert result.risk_score == 1.0  # All commits are security-related

    def test_predict_to_dict_json_serializable(self):
        """Test that prediction result can be serialized to JSON."""
        commits = [
            'abc123 feat: add docker support',
            'def456 test: add tests',
        ]
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        # Should not raise exception
        output_dict = result.to_dict()
        json_str = json.dumps(output_dict)
        
        # Verify we can parse it back
        parsed = json.loads(json_str)
        assert 'patterns' in parsed
        assert 'risk_score' in parsed
        assert 'high_risk_areas' in parsed


class TestMainFunction:
    """Test main CLI entry point."""

    @patch('predict_failures.subprocess.run')
    @patch('builtins.print')
    def test_main_output_format(self, mock_print, mock_run):
        """Test main function outputs valid JSON."""
        mock_result = Mock()
        mock_result.stdout = (
            'abc123 feat: add docker support\n'
            'def456 test: add unit tests\n'
        )
        mock_run.return_value = mock_result
        
        from predict_failures import main
        main()
        
        # Verify print was called once
        mock_print.assert_called_once()
        
        # Get the printed output
        output = mock_print.call_args[0][0]
        
        # Verify it's valid JSON
        parsed = json.loads(output)
        assert 'patterns' in parsed
        assert 'risk_score' in parsed
        assert 'high_risk_areas' in parsed


class TestIntegrationScenarios:
    """Integration tests for realistic scenarios."""

    def test_scenario_no_commits(self):
        """測試無 commit 場景 (Test scenario with no commits)."""
        commits = []
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        assert result.risk_score == 0.0
        assert result.high_risk_areas == []

    def test_scenario_normal_development(self):
        """Test normal development workflow."""
        commits = [
            'abc123 feat: add new API endpoint',
            'def456 docs: update README',
            'ghi789 refactor: clean up code',
            'jkl012 chore: bump version',
        ]
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        # Should have low risk for normal development
        assert result.risk_score == 0.0
        assert result.high_risk_areas == []

    def test_scenario_deployment_spike(self):
        """Test deployment-related commit spike."""
        commits = [
            f'commit{i} fix: docker deployment issue'
            for i in range(10)
        ]
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        # Should detect high docker-related risk
        assert result.patterns.docker == 10
        assert 'docker' in result.high_risk_areas
        assert result.risk_score == 1.0

    def test_scenario_critical_security_incident(self):
        """測試關鍵安全事件 (Test critical security incident scenario)."""
        commits = [
            'abc123 security: emergency patch CVE-2024-0001',
            'def456 security: fix authentication bypass',
            'ghi789 security: update encryption keys',
            'jkl012 security: patch XSS vulnerability',
            'mno345 security: fix SQL injection',
            'pqr678 security: update security dependencies',
            'stu901 security: audit trail improvements',
        ]
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        assert result.patterns.security == 7
        assert 'security' in result.high_risk_areas
        assert result.risk_score == 1.0

    def test_scenario_performance_optimization_sprint(self):
        """Test performance optimization sprint."""
        commits = [
            'abc123 perf: optimize database queries',
            'def456 perf: add caching layer',
            'ghi789 perf: reduce memory footprint',
            'jkl012 perf: improve API response time',
            'mno345 perf: optimize rendering',
            'pqr678 perf: add performance monitoring',
        ]
        
        predictor = FailurePredictor()
        result = predictor.predict(commits=commits)
        
        assert result.patterns.performance == 6
        assert 'performance' in result.high_risk_areas
