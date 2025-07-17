FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy app files
COPY . .

# Install dependencies
RUN pnpm install

# Build the app
RUN pnpm build

# Use a non-root user for security (optional, but recommended)
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
USER nextjs

EXPOSE 3000

CMD ["pnpm", "start"] 