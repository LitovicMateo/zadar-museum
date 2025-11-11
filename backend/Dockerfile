FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build
RUN npm run build

# Ensure the admin client build is available where the Strapi server expects it
# Some Strapi setups expect a server build under node_modules/@strapi/admin/dist/server/server/build
# Copy the project build into that path so the runtime can find the index.html
RUN mkdir -p /app/node_modules/@strapi/admin/dist/server/server/build \
 && cp -r ./dist/build/* /app/node_modules/@strapi/admin/dist/server/server/build/ || true
EXPOSE 1337

CMD ["npm", "run", "start"]