FROM node:20-alpine AS deps
WORKDIR /app
 
COPY package*.json ./
RUN npm ci 
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
 
RUN npm run build
 
# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app
 
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup
 
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/next.config.js ./next.config.mjs
 
RUN mkdir -p .next/cache/images && chown -R nodeuser:nodegroup .next

EXPOSE 3000

USER nodeuser
 
CMD ["npm", "start"]
