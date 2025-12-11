FROM node:18-alpine AS deps
WORKDIR /app
 
COPY package*.json ./
RUN npm ci
 
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
 
RUN npm run build
 
# ---- Production Stage ----
FROM node:18-alpine AS runner
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


# -----------------

#     # 1. Install Dependencies only when needed
# FROM node:18-alpine AS deps
# # Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
# RUN apk add --no-cache libc6-compat
# WORKDIR /app

# # Install dependencies based on the preferred package manager
# COPY package.json package-lock.json* ./
# RUN npm ci

# # 2. Rebuild the source code only when needed
# FROM node:18-alpine AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # This will now create a folder at .next/standalone
# RUN npm run build

# # 3. Production image, copy all the files and run next
# FROM node:18-alpine AS runner
# WORKDIR /app

# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED=1

# RUN addgroup --system --gid 1001 nodejs
# RUN adduser --system --uid 1001 nextjs

# # COPY public folder (if you have assets in public)
# COPY --from=builder /app/public ./public

# # Automatically leverage output traces to reduce image size
# # https://nextjs.org/docs/advanced-features/output-file-tracing
# # We copy the 'standalone' folder which contains a minimal node_modules
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# USER nextjs

# EXPOSE 3000

# # Next.js standalone server is run directly with node
# ENV PORT=3000
# CMD ["node", "server.js"]