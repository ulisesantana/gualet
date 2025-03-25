# Use Node.js as the base image
FROM node:22-alpine

# Set working directory
WORKDIR /app

# Copy backend and frontend
COPY . .

# Install dependencies
WORKDIR /app
RUN npm install && npm run build

# Expose port
EXPOSE 5050

# Run the application
CMD ["node", "backend/dist/main"]
