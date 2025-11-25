#!/usr/bin/env python3
"""
Auto Upgrade Environment Configuration
自動升級系統環境配置

Purpose: Automatically detect and install missing dependencies
When a dependency is missing, upgrade the environment instead of degrading functionality
當缺少依賴時，自動升級系統環境配置，而非降級功能
"""

import sys
import subprocess
import importlib
import logging
from typing import List, Dict, Optional, Tuple
from pathlib import Path

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class AutoUpgradeEnvironment:
    """
    自動升級環境管理器
    Automatically upgrades environment when dependencies are missing
    """
    
    # Define dependency mapping
    DEPENDENCY_MAP = {
        'dotenv': {
            'package': 'python-dotenv',
            'import_name': 'dotenv',
            'pip_install': 'python-dotenv>=1.0.0',
            'description': '環境變量管理 (Environment variable management)',
            'optional': True
        },
        'loguru': {
            'package': 'loguru',
            'import_name': 'loguru',
            'pip_install': 'loguru>=0.7.2',
            'description': '增強日誌功能 (Enhanced logging)',
            'optional': True
        },
        'pytest': {
            'package': 'pytest',
            'import_name': 'pytest',
            'pip_install': 'pytest>=8.0.0',
            'description': '測試框架 (Testing framework)',
            'optional': True,
            'dev_only': True
        },
        'pytest_asyncio': {
            'package': 'pytest-asyncio',
            'import_name': 'pytest_asyncio',
            'pip_install': 'pytest-asyncio>=0.23.5',
            'description': '異步測試支持 (Async testing support)',
            'optional': True,
            'dev_only': True
        },
    }
    
    def __init__(self, auto_install: bool = True):
        """
        Initialize auto upgrade environment
        
        Args:
            auto_install: Whether to automatically install missing dependencies
        """
        self.auto_install = auto_install
        self.missing_deps = []
        self.installed_deps = []
        
    def check_dependency(self, import_name: str) -> bool:
        """
        Check if a dependency is available
        
        Args:
            import_name: Name to use in import statement
            
        Returns:
            True if dependency is available, False otherwise
        """
        try:
            importlib.import_module(import_name)
            return True
        except ImportError:
            return False
    
    def install_package(self, pip_package: str) -> Tuple[bool, str]:
        """
        Install a package using pip
        
        Args:
            pip_package: Package specification for pip (e.g., 'loguru>=0.7.2')
            
        Returns:
            Tuple of (success, message)
        """
        try:
            logger.info(f"正在安裝 Installing: {pip_package}")
            
            # Use subprocess to install
            result = subprocess.run(
                [sys.executable, '-m', 'pip', 'install', pip_package, '--quiet'],
                capture_output=True,
                text=True,
                timeout=120
            )
            
            if result.returncode == 0:
                logger.info(f"✓ 安裝成功 Installed: {pip_package}")
                return True, f"Successfully installed {pip_package}"
            else:
                logger.error(f"✗ 安裝失敗 Failed: {pip_package}\n{result.stderr}")
                return False, f"Failed to install {pip_package}: {result.stderr}"
                
        except subprocess.TimeoutExpired:
            logger.error(f"✗ 安裝超時 Timeout: {pip_package}")
            return False, f"Installation timeout for {pip_package}"
        except Exception as e:
            logger.error(f"✗ 安裝錯誤 Error: {str(e)}")
            return False, f"Installation error: {str(e)}"
    
    def check_and_upgrade(self, dependencies: List[str]) -> Dict[str, bool]:
        """
        Check dependencies and auto-upgrade if missing
        
        Args:
            dependencies: List of dependency names to check
            
        Returns:
            Dictionary mapping dependency names to availability status
        """
        results = {}
        
        for dep_name in dependencies:
            if dep_name not in self.DEPENDENCY_MAP:
                logger.warning(f"未知依賴 Unknown dependency: {dep_name}")
                results[dep_name] = False
                continue
            
            dep_info = self.DEPENDENCY_MAP[dep_name]
            import_name = dep_info['import_name']
            
            # Check if already available
            if self.check_dependency(import_name):
                logger.info(f"✓ 依賴可用 Available: {dep_name}")
                results[dep_name] = True
                continue
            
            # If not available and auto_install is enabled
            if self.auto_install:
                logger.info(f"⚠ 缺少依賴 Missing dependency: {dep_name}")
                logger.info(f"   {dep_info['description']}")
                logger.info(f"   正在自動升級環境... Auto-upgrading environment...")
                
                success, message = self.install_package(dep_info['pip_install'])
                
                if success:
                    self.installed_deps.append(dep_name)
                    results[dep_name] = True
                    logger.info(f"✓ 環境升級成功 Environment upgraded for: {dep_name}")
                else:
                    self.missing_deps.append(dep_name)
                    results[dep_name] = False
                    
                    if not dep_info.get('optional', False):
                        logger.error(f"✗ 必需依賴安裝失敗 Required dependency failed: {dep_name}")
                    else:
                        logger.warning(f"⚠ 可選依賴安裝失敗 Optional dependency failed: {dep_name}")
            else:
                self.missing_deps.append(dep_name)
                results[dep_name] = False
                logger.warning(f"⚠ 缺少依賴（自動安裝已禁用）Missing: {dep_name}")
        
        return results
    
    def upgrade_all_optional(self) -> Dict[str, bool]:
        """
        Upgrade all optional dependencies
        
        Returns:
            Dictionary mapping dependency names to installation status
        """
        logger.info("=== 升級所有可選依賴 Upgrading all optional dependencies ===")
        
        optional_deps = [
            name for name, info in self.DEPENDENCY_MAP.items()
            if info.get('optional', False) and not info.get('dev_only', False)
        ]
        
        return self.check_and_upgrade(optional_deps)
    
    def get_summary(self) -> str:
        """
        Get upgrade summary
        
        Returns:
            Summary string
        """
        summary = "\n=== 環境升級摘要 Environment Upgrade Summary ===\n"
        
        if self.installed_deps:
            summary += f"\n✓ 已安裝依賴 Installed ({len(self.installed_deps)}):\n"
            for dep in self.installed_deps:
                summary += f"  - {dep}: {self.DEPENDENCY_MAP[dep]['description']}\n"
        
        if self.missing_deps:
            summary += f"\n⚠ 未能安裝 Failed to install ({len(self.missing_deps)}):\n"
            for dep in self.missing_deps:
                summary += f"  - {dep}: {self.DEPENDENCY_MAP[dep]['description']}\n"
                if self.DEPENDENCY_MAP[dep].get('optional', False):
                    summary += f"    (可選依賴，功能可能受限 Optional, features may be limited)\n"
        
        if not self.installed_deps and not self.missing_deps:
            summary += "\n✓ 所有依賴已就緒 All dependencies ready\n"
        
        return summary


def auto_upgrade_on_import():
    """
    Automatically upgrade environment when module is imported
    當模組被導入時自動升級環境
    """
    upgrader = AutoUpgradeEnvironment(auto_install=True)
    
    # Check core optional dependencies
    core_deps = ['dotenv', 'loguru']
    
    logger.info("=== 自動環境升級檢查 Auto Environment Upgrade Check ===")
    results = upgrader.check_and_upgrade(core_deps)
    
    # Print summary
    print(upgrader.get_summary())
    
    return upgrader


# Example usage
if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description='Auto Upgrade Environment Configuration'
    )
    parser.add_argument(
        '--upgrade-all',
        action='store_true',
        help='Upgrade all optional dependencies'
    )
    parser.add_argument(
        '--check-only',
        action='store_true',
        help='Check dependencies without installing'
    )
    parser.add_argument(
        '--deps',
        nargs='+',
        help='Specific dependencies to check/upgrade'
    )
    
    args = parser.parse_args()
    
    # Create upgrader
    upgrader = AutoUpgradeEnvironment(auto_install=not args.check_only)
    
    print("=== 智能環境升級系統 Intelligent Environment Upgrade System ===\n")
    
    if args.upgrade_all:
        # Upgrade all optional dependencies
        results = upgrader.upgrade_all_optional()
    elif args.deps:
        # Upgrade specific dependencies
        results = upgrader.check_and_upgrade(args.deps)
    else:
        # Check core dependencies
        core_deps = ['dotenv', 'loguru']
        results = upgrader.check_and_upgrade(core_deps)
    
    # Print summary
    print(upgrader.get_summary())
    
    # Exit with appropriate code
    if upgrader.missing_deps and not all(
        AutoUpgradeEnvironment.DEPENDENCY_MAP[dep].get('optional', False)
        for dep in upgrader.missing_deps
    ):
        print("\n✗ 存在未安裝的必需依賴 Required dependencies missing")
        sys.exit(1)
    else:
        print("\n✓ 環境配置完成 Environment configuration complete")
        sys.exit(0)
