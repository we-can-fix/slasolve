# 多階段構建 - 企業級生產 Dockerfile
# 使用 Debian-based 映像以避免 Alpine 網路問題
# Stage 1: Builder
FROM node:18-slim AS builder

# 安全：建立非 root 使用者
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

# 安裝必要的構建工具
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    dumb-init && \
    rm -rf /var/lib/apt/lists/*

# 設定工作目錄
WORKDIR /app

# 複製套件定義檔（利用 Docker layer cache）
COPY --chown=nodejs:nodejs package*.json ./
COPY --chown=nodejs:nodejs tsconfig.json ./

# 切換到非 root 使用者進行構建
USER nodejs

# 安裝依賴（包含 devDependencies 用於構建）
RUN npm ci && \
    npm cache clean --force

# 複製原始碼
COPY --chown=nodejs:nodejs src ./src

# 構建 TypeScript
RUN npm run build

# 直接以 nodejs 使用者執行清理，符合最小權限原則
# 移除 devDependencies
RUN npm prune --production

# Stage 2: Runner (最小生產映像)
FROM node:18-slim AS runner

# 安裝運行時必要工具
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    ca-certificates \
    dumb-init && \
    rm -rf /var/lib/apt/lists/*

# 安全加固：建立非 root 使用者
RUN groupadd -g 1001 nodejs && \
    useradd -r -u 1001 -g nodejs nodejs

# 設定工作目錄
WORKDIR /app

# 建立必要的臨時目錄
RUN mkdir -p /tmp /app/.npm && \
    chown -R nodejs:nodejs /tmp /app/.npm

# 從 builder 階段複製必要產物
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

# 切換到非 root 使用者
USER nodejs

# 環境變數
ENV NODE_ENV=production \
    PORT=3000 \
    LOG_LEVEL=info \
    NODE_OPTIONS="--max-old-space-size=512"

# 暴露端口
EXPOSE 3000

# 健康檢查
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/healthz', (r) => { process.exit(r.statusCode === 200 ? 0 : 1); })"

# 使用 dumb-init 作為 init 處理程序（正確處理信號和殭屍進程）
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

# 啟動應用
CMD ["node", "dist/server.js"]
