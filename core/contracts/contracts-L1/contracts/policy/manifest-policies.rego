# Kubernetes Manifest 政策驗證
# 基於 OPA/Rego 的可執行政策

package kubernetes.admission

# 拒絕沒有資源限制的容器
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.resources.limits
  msg := sprintf("容器 '%s' 必須定義資源限制 (resources.limits)", [container.name])
}

# 拒絕沒有資源請求的容器
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.resources.requests
  msg := sprintf("容器 '%s' 必須定義資源請求 (resources.requests)", [container.name])
}

# 拒絕以 root 身份運行的容器
deny[msg] {
  input.kind == "Deployment"
  not input.spec.template.spec.securityContext.runAsNonRoot
  msg := "Pod 必須設定 runAsNonRoot: true"
}

# 拒絕沒有 liveness probe 的容器
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.livenessProbe
  msg := sprintf("容器 '%s' 必須定義 livenessProbe", [container.name])
}

# 拒絕沒有 readiness probe 的容器
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  not container.readinessProbe
  msg := sprintf("容器 '%s' 必須定義 readinessProbe", [container.name])
}

# 拒絕沒有命名空間標籤的資源
deny[msg] {
  input.kind == "Deployment"
  not input.metadata.labels["namespace.io/team"]
  msg := "Deployment 必須有 'namespace.io/team' 標籤"
}

deny[msg] {
  input.kind == "Deployment"
  not input.metadata.labels["namespace.io/environment"]
  msg := "Deployment 必須有 'namespace.io/environment' 標籤"
}

# 拒絕使用 latest 標籤的映像
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  endswith(container.image, ":latest")
  msg := sprintf("容器 '%s' 不能使用 ':latest' 標籤", [container.name])
}

# 拒絕特權容器
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  container.securityContext.privileged == true
  msg := sprintf("容器 '%s' 不能以特權模式運行", [container.name])
}

# 拒絕允許權限提升的容器
deny[msg] {
  input.kind == "Deployment"
  container := input.spec.template.spec.containers[_]
  container.securityContext.allowPrivilegeEscalation != false
  msg := sprintf("容器 '%s' 必須設定 allowPrivilegeEscalation: false", [container.name])
}

# Service 必須有明確的 port 名稱
deny[msg] {
  input.kind == "Service"
  port := input.spec.ports[_]
  not port.name
  msg := sprintf("Service port %d 必須有名稱", [port.port])
}

# NetworkPolicy 應該存在
warn[msg] {
  input.kind == "Deployment"
  not has_networkpolicy
  msg := "建議為 Deployment 定義 NetworkPolicy"
}

has_networkpolicy {
  # 這個檢查需要在政策模擬時檢查是否有對應的 NetworkPolicy
  # 簡化版本：僅作為警告
  false
}
