# Use Node.js 18 Debian Bullseye as base image (avoids Alpine musl issues)
FROM node:18-bullseye AS base

# Set working directory
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps

# Copy package files and npm configuration
COPY package.json package-lock.json* .npmrc ./

# Set environment variables to disable native modules
ENV ROLLUP_NO_NATIVE=1
ENV ROLLUP_SKIP_NATIVE=true

# Install dependencies (allow optional dependencies to avoid musl issues)
RUN npm install --production=false --legacy-peer-deps \
    && npm cache clean --force

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source code and npm configuration
COPY . .

# Set environment variables for build
ENV NODE_ENV=production
ENV NODE_OPTIONS="--max-old-space-size=4096"
# Force Rollup to use JS-only version
ENV ROLLUP_NO_NATIVE=1
ENV ROLLUP_SKIP_NATIVE=true

# Build the application with JS-only approach
RUN npm run build || (echo "Initial build failed, retrying with clean install..." && \
    rm -rf node_modules && \
    npm install --production=false --legacy-peer-deps && \
    npm run build)

# Production image, copy all the files and run the app
FROM node:18-bullseye AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000
# Ensure runtime also uses JS-only Rollup
ENV ROLLUP_NO_NATIVE=1

# Create a non-root user
RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nodejs

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Install only production dependencies in final image
RUN npm install --only=production --ignore-scripts \
    && npm cache clean --force \
    && rm -rf /tmp/*

# Change ownership to nodejs user
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:10000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"] 