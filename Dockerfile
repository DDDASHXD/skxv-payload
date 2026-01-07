# ---- base ----
  FROM node:20-alpine AS base
  WORKDIR /app
  
  # pnpm
  RUN corepack enable
  
  # ---- deps ----
  FROM base AS deps
  COPY package.json pnpm-lock.yaml ./
  RUN pnpm install --frozen-lockfile
  
  # ---- build ----
  FROM base AS builder

  ARG PAYLOAD_SECRET
  ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
  
  COPY --from=deps /app/node_modules ./node_modules
  COPY . .
  RUN pnpm build
  
  # ---- runtime ----
  FROM node:20-alpine AS runtime
  WORKDIR /app
  ENV NODE_ENV=production
  
  # If you use sharp (Next Image Optimization), you may need libc6-compat:
  # RUN apk add --no-cache libc6-compat
  
  # Copy standalone server + static assets
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  COPY --from=builder /app/public ./public
  
  EXPOSE 3000
  CMD ["node", "server.js"]
  