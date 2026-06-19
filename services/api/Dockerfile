# Multi-stage Dockerfile for NestJS API

# Stage 1: Dependencies
FROM node:18-alpine AS dependencies
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --production && \
    npm cache clean --force

# Stage 2: Build
FROM node:18-alpine AS build
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install all dependencies (including dev)
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate

# Build the application
RUN npm run build

# Stage 3: Production
FROM node:18-alpine AS production
WORKDIR /app

# Install dumb-init and OpenSSL for Prisma
RUN apk add --no-cache dumb-init openssl

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Copy dependencies from dependencies stage
COPY --from=dependencies --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=dependencies --chown=nestjs:nodejs /app/prisma ./prisma

# Copy built application from build stage
COPY --from=build --chown=nestjs:nodejs /app/dist ./dist
COPY --from=build --chown=nestjs:nodejs /app/package*.json ./

# Generate Prisma Client in production stage
ENV NODE_TLS_REJECT_UNAUTHORIZED=0
RUN npx prisma generate

# Create uploads directory
RUN mkdir -p uploads && chown -R nestjs:nodejs uploads

# Switch to non-root user
USER nestjs

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Start the application
CMD ["node", "dist/main.js"]
