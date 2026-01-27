# Development stage
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "dev"]

# Build stage
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
# Install build deps as root to avoid permission issues during install
RUN npm ci --no-audit --progress=false --unsafe-perm=true
COPY . .
ARG VITE_API_ROOT
ENV VITE_API_ROOT=$VITE_API_ROOT
RUN npm run build

# Production stage
FROM nginx:alpine AS production
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]