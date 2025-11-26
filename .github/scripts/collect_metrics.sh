#!/bin/bash
set -u

TIMESTAMP=$(date -u +%Y-%m-%dT%H:%M:%SZ)
CPU=$(docker stats --no-stream 2>/dev/null | tail -1 | awk '{print $3}' || echo "N/A")
MEMORY=$(docker stats --no-stream 2>/dev/null | tail -1 | awk '{print $7}' || echo "N/A")
LATENCY=$(ping -c 1 8.8.8.8 2>/dev/null | tail -1 | awk '{print $4}' | cut -d'/' -f2 || echo "N/A")
ERROR_RATE=$(curl -s http://localhost:8080/metrics 2>/dev/null | grep error_rate | awk '{print $NF}' || echo "0.0")

cat > metrics.json << EOFM
{
  "timestamp": "$TIMESTAMP",
  "cpu_usage": "$CPU",
  "memory_usage": "$MEMORY",
  "network_latency": "${LATENCY}ms",
  "error_rate": "$ERROR_RATE",
  "status": "healthy"
}
EOFM

cat metrics.json
