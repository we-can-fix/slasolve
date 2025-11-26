#!/usr/bin/env python3
"""
ML-based failure prediction for CI/CD pipelines.

此模組實作基於 commit 歷史的智慧故障預測，用於自動駕駛級 CI 守護者系統。

Analyzes commit history to predict potential CI/CD failures based on
historical patterns and risk indicators.
"""

import json
import subprocess
from dataclasses import dataclass, asdict
from typing import Dict, List, Optional


@dataclass
class FailurePatterns:
    """Failure pattern categories and their occurrence counts."""
    
    docker: int = 0
    test: int = 0
    performance: int = 0
    security: int = 0
    memory: int = 0

    def to_dict(self) -> Dict[str, int]:
        """Convert to dictionary for JSON serialization."""
        return asdict(self)


@dataclass
class PredictionResult:
    """ML prediction result with risk assessment."""
    
    patterns: FailurePatterns
    risk_score: float
    high_risk_areas: List[str]

    def to_dict(self) -> dict:
        """Convert to dictionary for JSON serialization."""
        return {
            'patterns': self.patterns.to_dict(),
            'risk_score': self.risk_score,
            'high_risk_areas': self.high_risk_areas,
        }


class FailurePredictor:
    """
    預測 CI/CD 故障的 ML 模型 (Predicts CI/CD failures using ML analysis).
    
    Analyzes git commit history to identify patterns that correlate with
    build failures, test failures, and deployment issues.
    """

    # Pattern keywords for different failure categories
    PATTERN_KEYWORDS = {
        'docker': ['docker', 'compose', 'image', 'container'],
        'test': ['test', 'spec', 'unit', 'integration'],
        'performance': ['perf', 'optimize', 'speed', 'performance'],
        'security': ['security', 'auth', 'encrypt', 'vulnerability'],
        'memory': ['memory', 'leak', 'gc', 'heap'],
    }

    # Threshold for high-risk area classification
    HIGH_RISK_THRESHOLD = 5

    def __init__(self, fetch_depth: int = 50):
        """
        初始化預測器 (Initialize failure predictor).
        
        Args:
            fetch_depth: Number of commits to analyze for pattern detection
        """
        self.fetch_depth = fetch_depth

    def get_commit_history(self) -> List[str]:
        """
        取得 Git commit 歷史 (Fetch git commit history).
        
        Returns:
            List of commit messages (one-line format)
            
        Raises:
            subprocess.CalledProcessError: If git command fails
        """
        result = subprocess.run(
            ['git', 'log', '--oneline', f'-{self.fetch_depth}'],
            capture_output=True,
            text=True,
            check=True,
        )
        
        commits = [line for line in result.stdout.strip().split('\n') if line]
        return commits

    def analyze_patterns(self, commits: List[str]) -> FailurePatterns:
        """
        分析 commit 中的故障模式 (Analyze failure patterns in commits).
        
        Args:
            commits: List of commit messages to analyze
            
        Returns:
            FailurePatterns object with pattern counts
        """
        patterns = FailurePatterns()
        
        for commit in commits:
            lowered = commit.lower()
            
            for category, keywords in self.PATTERN_KEYWORDS.items():
                if any(keyword in lowered for keyword in keywords):
                    current_value = getattr(patterns, category)
                    setattr(patterns, category, current_value + 1)
        
        return patterns

    def calculate_risk_score(self, patterns: FailurePatterns) -> float:
        """
        計算風險分數 (Calculate overall risk score).
        
        Risk score is calculated as the ratio of the most frequent pattern
        to the total number of pattern occurrences.
        
        Args:
            patterns: Detected failure patterns
            
        Returns:
            Risk score between 0.0 and 1.0
        """
        pattern_dict = patterns.to_dict()
        total = sum(pattern_dict.values()) or 1
        max_pattern = max(pattern_dict.values())
        
        return max_pattern / total

    def identify_high_risk_areas(self, patterns: FailurePatterns) -> List[str]:
        """
        識別高風險區域 (Identify high-risk areas).
        
        Areas are considered high-risk if their pattern count exceeds
        the HIGH_RISK_THRESHOLD.
        
        Args:
            patterns: Detected failure patterns
            
        Returns:
            List of high-risk area names
        """
        pattern_dict = patterns.to_dict()
        return [
            area for area, count in pattern_dict.items()
            if count > self.HIGH_RISK_THRESHOLD
        ]

    def predict(self, commits: Optional[List[str]] = None) -> PredictionResult:
        """
        執行完整預測流程 (Execute complete prediction workflow).
        
        Args:
            commits: Optional list of commits. If None, fetches from git history
            
        Returns:
            PredictionResult with patterns, risk score, and high-risk areas
        """
        if commits is None:
            commits = self.get_commit_history()
        
        patterns = self.analyze_patterns(commits)
        risk_score = self.calculate_risk_score(patterns)
        high_risk_areas = self.identify_high_risk_areas(patterns)
        
        return PredictionResult(
            patterns=patterns,
            risk_score=risk_score,
            high_risk_areas=high_risk_areas,
        )


def main():
    """
    主程式入口點 (Main entry point for CLI usage).
    
    Runs prediction and outputs JSON result to stdout.
    """
    predictor = FailurePredictor()
    result = predictor.predict()
    
    # Output as JSON for consumption by GitHub Actions
    output = result.to_dict()
    print(json.dumps(output))


if __name__ == '__main__':
    main()
