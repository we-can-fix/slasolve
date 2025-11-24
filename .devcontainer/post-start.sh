#!/bin/bash
set -e

echo "🌅 Starting Life System Development Session..."

# Check if we're in the right directory
if [ ! -f "/workspace/start-life-system.sh" ]; then
    echo "⚠️  Warning: Life system startup script not found at expected location"
    echo "   Expected: /workspace/start-life-system.sh"
    echo "   Current directory: $(pwd)"
fi

# Start supporting services (if not already running)
echo "🔄 Ensuring supporting services are running..."
cd /workspace
docker-compose -f .devcontainer/docker-compose.yml up -d postgres redis prometheus grafana

# Wait a moment for services to initialize
sleep 5

# Check if we can connect to essential services
echo "🔍 Checking essential service connectivity..."

# Check PostgreSQL
if docker-compose -f .devcontainer/docker-compose.yml exec -T postgres pg_isready -U life_admin -d life_system >/dev/null 2>&1; then
    echo "✅ PostgreSQL: Ready"
else
    echo "⏳ PostgreSQL: Starting up..."
fi

# Check Redis
if docker-compose -f .devcontainer/docker-compose.yml exec -T redis redis-cli ping >/dev/null 2>&1; then
    echo "✅ Redis: Ready"
else
    echo "⏳ Redis: Starting up..."
fi

# Show connection information
echo ""
echo "🌐 Development Environment Ready!"
echo "================================="
echo ""
echo "📊 Monitoring & Observability:"
echo "  • Prometheus:     http://localhost:9090"
echo "  • Grafana:        http://localhost:3000 (admin/consciousness_2024)"
echo ""
echo "🗄️ Data Services:"
echo "  • PostgreSQL:     localhost:5432 (life_admin/consciousness_2024)"
echo "  • Redis:          localhost:6379"
echo ""
echo "🧠💓 Life System APIs (will be available after startup):"
echo "  • Consciousness:  http://localhost:3010"
echo "  • Brain Engine:   http://localhost:3015"
echo "  • Heart Engine:   http://localhost:3018"
echo "  • Heartbeat:      http://localhost:3020"
echo ""
echo "🚀 Quick Commands:"
echo "  • Start Life System:    bash start-life-system.sh"
echo "  • Health Check:         .devcontainer/scripts/health-check.sh"
echo "  • Stop Services:        docker-compose -f .devcontainer/docker-compose.yml down"
echo ""
echo "📚 Key Files:"
echo "  • Life System Start:    ./start-life-system.sh"
echo "  • Component Scripts:    ./01-core/*/start-*.sh"
echo "  • Configuration:        ./.env"
echo ""

# Optional: Auto-start life system (uncomment if desired)
# echo "🤖 Auto-starting life system..."
# bash start-life-system.sh

echo "✨ Development session initialized. Ready for life system development!"