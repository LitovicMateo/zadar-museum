# backend/Dockerfile
FROM node:20-alpine AS deps
WORKDIR /srv/app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /srv/app
COPY --from=deps /srv/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS run
WORKDIR /srv/app
ENV NODE_ENV=production
COPY --from=build /srv/app ./
EXPOSE 1337
CMD ["npm", "run", "start"]
