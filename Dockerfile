# Multi-stage production build for Geo Infrastructure Intelligence
FROM node:22-slim AS builder

WORKDIR /app

# Copy dependency files
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Vite frontend bundle
RUN npm run build

# Production runtime image
FROM node:22-slim AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package descriptors
COPY package*.json ./
RUN npm ci --omit=dev && npm install -g tsx

# Copy built frontend assets and required server source files
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/data ./data
COPY --from=builder /app/server.ts ./server.ts
COPY --from=builder /app/src/server ./src/server
COPY --from=builder /app/src/types.ts ./src/types.ts
COPY --from=builder /app/src/data ./src/data
COPY --from=builder /app/src/utils ./src/utils
COPY --from=builder /app/tsconfig.json ./tsconfig.json

EXPOSE 3000

CMD ["npx", "tsx", "server.ts"]
