# 架構穩定性骨架 (Architecture Stability Skeleton)

## 概述

C++ 核心控制層，使用 ROS 2 實現無人機/無人駕駛的即時控制、感測器融合。

## 功能特性

- ✅ **即時控制**：100Hz 控制迴圈確保低延遲
- ✅ **感測器融合**：訂閱 IMU 感測器資料並進行融合
- ✅ **PID 控制**：實現高度和偏航角控制算法
- ✅ **ROS 2 整合**：使用 ROS 2 Humble/Iron/Jazzy

## 系統需求

- Ubuntu 20.04 或更高版本
- ROS 2 (Humble, Iron, 或 Jazzy)
- C++17 編譯器
- CMake >= 3.8

## 構建說明

```bash
# 安裝 ROS 2 依賴
rosdep install --from-paths . --ignore-src -r -y

# 構建
colcon build --symlink-install

# 或使用 CMake
mkdir build && cd build
cmake ..
make -j$(nproc)
```

## 運行示例

```bash
# 啟動飛行控制器
ros2 run autonomy_core flight_controller

# 在另一個終端查看主題
ros2 topic list
ros2 topic echo /cmd_vel

# 發送 IMU 數據進行測試
ros2 topic pub /imu/data sensor_msgs/msg/Imu "{...}"
```

## 預期輸出

```
[INFO] [flight_controller]: Flight Controller initialized
[INFO] [flight_controller]: Publishing control command: linear.z=0.5, angular.z=0.1
```

## 架構說明

```
┌─────────────────────────────────────┐
│     Flight Controller Node          │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────┐  ┌─────────────┐ │
│  │ IMU          │  │ Control     │ │
│  │ Subscriber   │──│ Loop (100Hz)│ │
│  └──────────────┘  └─────────────┘ │
│         │                  │        │
│         ▼                  ▼        │
│  ┌──────────────┐  ┌─────────────┐ │
│  │ Sensor       │  │ Cmd Vel     │ │
│  │ Fusion       │  │ Publisher   │ │
│  └──────────────┘  └─────────────┘ │
└─────────────────────────────────────┘
```

## 整合點

此模組整合至 SLASolve 平台，提供：

1. **即時控制能力**：為自治系統提供底層控制
2. **感測器融合**：整合多種感測器數據
3. **標準化介面**：通過 ROS 2 主題和服務與其他模組通信

## 參考資料

- [ROS 2 Documentation](https://docs.ros.org/en/humble/)
- [Colcon Build System](https://colcon.readthedocs.io/)
- [Gazebo Simulator](https://gazebosim.org/)
