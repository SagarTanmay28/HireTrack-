# Stage 1: Build the React app
FROM node:20-slim AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# This creates the /app/dist folder with all static files
RUN npm run build

# Stage 2: Serve with Nginx (lightweight, production-ready)
FROM nginx:alpine

# Copy built files to nginx's public folder
COPY --from=builder /app/dist /usr/share/nginx/html

# Custom nginx config to handle React Router (client-side routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
