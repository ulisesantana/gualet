# Use Node.js as the base image
FROM node:22-alpine
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
COPY packages/backend/package*.json ./packages/backend/
COPY packages/frontend/package*.json ./packages/frontend/
COPY packages/shared/package*.json ./packages/shared/

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the application
RUN npm run build -w @gualet/shared \
 && npm run build -w @gualet/backend \
 && npm run build -w @gualet/frontend \
 && cp -r ./packages/frontend/dist ./packages/backend/dist/public

# Expose port
EXPOSE 5050

# Run the application
CMD ["node", "packages/backend/dist/main"]
