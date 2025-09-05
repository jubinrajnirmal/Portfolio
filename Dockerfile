# Use Node.js 20 Alpine for security and size optimization
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S portfolio -u 1001

# Install serve with pinned version for consistent builds
RUN npm install -g serve@14.2.1

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies (if any)
RUN npm ci --only=production && npm cache clean --force

# Copy application files
COPY --chown=portfolio:nodejs . .

# Remove unnecessary files for production
RUN rm -rf .git .gitignore .dockerignore Dockerfile README.md k8s/ && \
    # Ensure assets directory exists
    mkdir -p assets && \
    # Set proper permissions
    chown -R portfolio:nodejs /app

# Switch to non-root user
USER portfolio

# Expose port 3000
EXPOSE 3000

# Health check to ensure the server is running
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Command to run the application
CMD ["serve", "-s", ".", "-l", "3000", "--no-clipboard"]
