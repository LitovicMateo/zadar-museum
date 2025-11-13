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
RUN npm run build || true


FROM node:20-alpine AS runtime

WORKDIR /app

# Install only production dependencies in the final image
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled output and app files from the builder stage
COPY --from=builder /app .

# Ensure the admin client build is available where the Strapi server expects it
RUN mkdir -p /app/node_modules/@strapi/admin/dist/server/server/build \
 && cp -r ./dist/build/* /app/node_modules/@strapi/admin/dist/server/server/build/ || true

EXPOSE 1337

CMD ["npm", "run", "start"]