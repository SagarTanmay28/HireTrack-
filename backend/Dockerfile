# Use official Node.js slim image - smaller than full image
FROM node:20-slim

WORKDIR /app

# Copy package files first - Docker caches this layer
# so npm install only re-runs if package.json changes
COPY package*.json ./
RUN npm install --production

# Copy source code
COPY . .

EXPOSE 5000

CMD ["node", "src/index.js"]
