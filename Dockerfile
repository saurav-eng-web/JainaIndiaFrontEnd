# --------------------------- Dependencies Stage ---------------------------
FROM node:18-alpine AS deps
WORKDIR /app

COPY package*.json ./
RUN npm ci



# --------------------------- Builder Stage ---------------------------
FROM node:18-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .


ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_ID
ARG NEXT_PUBLIC_PASS

ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_ID=$NEXT_PUBLIC_ID
ENV NEXT_PUBLIC_PASS=$NEXT_PUBLIC_PASS


RUN npm run build



# --------------------------- Production Runner Stage ---------------------------
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create secure non-root user
RUN addgroup -S nodegroup && adduser -S nodeuser -G nodegroup

# Copy build output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

RUN mkdir -p .next/cache/images && chown -R nodeuser:nodegroup .next

# Expose application port
EXPOSE 3000

# Run as unprivileged user
USER nodeuser

# Start Next.js (standalone mode compatible)
CMD ["npm", "start"]
