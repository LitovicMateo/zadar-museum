FROM node:20-alpine AS development

USER root
WORKDIR /app

# Development image: install dependencies but skip build steps.
# This target is used for local development and runs `npm run develop`.
COPY package*.json ./
COPY --chmod=755 docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN npm ci

EXPOSE 1337

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["npm", "run", "develop"]


FROM node:20-alpine AS builder

WORKDIR /app

# Install all dependencies (including dev) in the builder
COPY package*.json ./
RUN npm ci

# Copy source and build artifacts
COPY . .

# Compile TypeScript to the configured outDir and run Strapi's build
# If tsc is not used in this project this will be a no-op; keep it so projects
# that need a TS compile step are handled.
RUN npx tsc -p tsconfig.json || true
RUN npm run build


FROM node:20-alpine AS runtime

WORKDIR /app

RUN apk add --no-cache curl

# Copy the built app (including node_modules) from the builder stage
COPY --from=builder /app .

# Strip dev dependencies from the runtime image
RUN npm prune --omit=dev

# Ensure the admin client build is available where the Strapi server expects it
RUN mkdir -p /app/node_modules/@strapi/admin/dist/server/server/build \
 && cp -r ./dist/build/* /app/node_modules/@strapi/admin/dist/server/server/build/ || true

EXPOSE 1337

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=5 \
  CMD curl -f http://127.0.0.1:1337/admin || exit 1

CMD ["npm", "run", "start"]