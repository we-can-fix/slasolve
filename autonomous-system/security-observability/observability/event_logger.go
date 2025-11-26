// autonomous-system/security-observability/observability/event_logger.go
package observability

import (
	"encoding/json"
	"fmt"
	"log"
	"sync"
	"time"
)

// EventCategory 事件分類
type EventCategory string

const (
	EventSensorError     EventCategory = "sensor_error"
	EventControlError    EventCategory = "control_error"
	EventSafetyViolation EventCategory = "safety_violation"
	EventSystemError     EventCategory = "system_error"
	EventAudit           EventCategory = "audit"
)

// Event 事件結構
type Event struct {
	Timestamp   time.Time              `json:"timestamp"`
	Category    EventCategory          `json:"category"`
	Module      string                 `json:"module"`
	Severity    string                 `json:"severity"` // "INFO", "WARN", "ERROR", "CRITICAL"
	Message     string                 `json:"message"`
	Metadata    map[string]interface{} `json:"metadata"`
	TraceID     string                 `json:"trace_id"`
	ParentID    string                 `json:"parent_id"`
}

// EventLogger 事件日誌記錄器
type EventLogger struct {
	events chan Event
	store  []Event
	mu     sync.RWMutex
}

// NewEventLogger 創建新的事件日誌記錄器
func NewEventLogger(bufferSize int) *EventLogger {
	logger := &EventLogger{
		events: make(chan Event, bufferSize),
		store:  make([]Event, 0),
	}
	
	// 啟動後台日誌處理
	go logger.processEvents()
	
	return logger
}

// LogEvent 記錄事件
func (el *EventLogger) LogEvent(category EventCategory, module, severity, message string, metadata map[string]interface{}) {
	event := Event{
		Timestamp: time.Now(),
		Category:  category,
		Module:    module,
		Severity:  severity,
		Message:   message,
		Metadata:  metadata,
		TraceID:   generateTraceID(),
	}
	
	el.events <- event
}

// processEvents 後台事件處理
func (el *EventLogger) processEvents() {
	for event := range el.events {
		el.mu.Lock()
		el.store = append(el.store, event)
		el.mu.Unlock()
		
		// 輸出到標準日誌
		logLevel := map[string]string{
			"INFO":     "ℹ️",
			"WARN":     "⚠️",
			"ERROR":    "❌",
			"CRITICAL": "🚨",
		}
		
		icon := logLevel[event.Severity]
		log.Printf("%s [%s] %s/%s: %s (TraceID: %s)",
			icon, event.Category, event.Module, event.Severity, event.Message, event.TraceID)
	}
}

// GetEventsByCategory 按分類查詢事件
func (el *EventLogger) GetEventsByCategory(category EventCategory) []Event {
	el.mu.RLock()
	defer el.mu.RUnlock()
	
	var results []Event
	for _, event := range el.store {
		if event.Category == category {
			results = append(results, event)
		}
	}
	return results
}

// GetEventsBySeverity 按嚴重性查詢事件
func (el *EventLogger) GetEventsBySeverity(severity string) []Event {
	el.mu.RLock()
	defer el.mu.RUnlock()
	
	var results []Event
	for _, event := range el.store {
		if event.Severity == severity {
			results = append(results, event)
		}
	}
	return results
}

// ExportJSON 導出 JSON 格式日誌
func (el *EventLogger) ExportJSON() (string, error) {
	el.mu.RLock()
	defer el.mu.RUnlock()
	
	data, err := json.MarshalIndent(el.store, "", "  ")
	if err != nil {
		return "", err
	}
	return string(data), nil
}

// generateTraceID 生成追蹤 ID
func generateTraceID() string {
	return fmt.Sprintf("trace_%d", time.Now().UnixNano())
}

// SafetyMonitor 安全監控器
type SafetyMonitor struct {
	logger *EventLogger
	mu     sync.RWMutex
}

// NewSafetyMonitor 創建安全監控器
func NewSafetyMonitor(logger *EventLogger) *SafetyMonitor {
	return &SafetyMonitor{logger: logger}
}

// CheckAltitudeLimit 檢查高度限制
func (sm *SafetyMonitor) CheckAltitudeLimit(altitude float64, maxAltitude float64) bool {
	if altitude > maxAltitude {
		sm.logger.LogEvent(
			EventSafetyViolation,
			"safety_monitor",
			"CRITICAL",
			fmt.Sprintf("Altitude exceeded: %.2f > %.2f", altitude, maxAltitude),
			map[string]interface{}{
				"current_altitude": altitude,
				"max_altitude":     maxAltitude,
			},
		)
		return false
	}
	return true
}

// CheckVelocityLimit 檢查速度限制
func (sm *SafetyMonitor) CheckVelocityLimit(velocity float64, maxVelocity float64) bool {
	if velocity > maxVelocity {
		sm.logger.LogEvent(
			EventSafetyViolation,
			"safety_monitor",
			"CRITICAL",
			fmt.Sprintf("Velocity exceeded: %.2f > %.2f", velocity, maxVelocity),
			map[string]interface{}{
				"current_velocity": velocity,
				"max_velocity":     maxVelocity,
			},
		)
		return false
	}
	return true
}

// GenerateSafetyReport 生成安全報告
func (sm *SafetyMonitor) GenerateSafetyReport() string {
	violations := sm.logger.GetEventsByCategory(EventSafetyViolation)
	errors := sm.logger.GetEventsByCategory(EventSensorError)
	
	report := fmt.Sprintf(`
╔════════════════════════════════════════╗
║          安全監控報告                    ║
╚════════════════════════════════════════╝

安全違規事件：%d
感測器錯誤：%d
總事件數：%d

最近的安全違規：
`, len(violations), len(errors), len(sm.logger.store))
	
	for i, v := range violations {
		if i >= 5 { // 只顯示最近 5 個
			break
		}
		report += fmt.Sprintf("  • %s: %s\n", v.Timestamp.Format("15:04:05"), v.Message)
	}
	
	return report
}
