# Development stage
FROM oven/bun:1-alpine

WORKDIR /app

# Copy package files
COPY package*.json bun.lockb* ./

# Install dependencies
RUN bun install

# Copy source code
COPY . .

# Expose port (common dev server ports)
EXPOSE 3000

# Start development server
CMD ["bun", "run", "dev"]
