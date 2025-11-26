// main.go - 使用範例
package main

import (
	"fmt"
	"time"
	"./observability"
)

func main() {
	// 創建事件日誌記錄器
	logger := observability.NewEventLogger(100)
	
	// 創建安全監控器
	monitor := observability.NewSafetyMonitor(logger)
	
	// 記錄系統啟動事件
	logger.LogEvent(
		observability.EventAudit,
		"flight_controller",
		"INFO",
		"System started",
		nil,
	)
	
	// 模擬感測器錯誤
	logger.LogEvent(
		observability.EventSensorError,
		"sensor_fusion",
		"WARN",
		"IMU calibration drift detected",
		map[string]interface{}{
			"drift_value": 0.05,
			"threshold":   0.03,
		},
	)
	
	// 檢查高度限制
	monitor.CheckAltitudeLimit(150.0, 100.0)
	
	// 檢查速度限制
	monitor.CheckVelocityLimit(25.0, 30.0)
	
	// 等待事件處理
	time.Sleep(100 * time.Millisecond)
	
	// 生成安全報告
	report := monitor.GenerateSafetyReport()
	fmt.Println(report)
	
	// 導出 JSON 日誌
	jsonLog, err := logger.ExportJSON()
	if err != nil {
		fmt.Printf("Error exporting JSON: %v\n", err)
		return
	}
	
	fmt.Println("\n日誌 JSON 導出：")
	fmt.Println(jsonLog)
}
