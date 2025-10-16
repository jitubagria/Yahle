FROM node:18-bullseye AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build || true

FROM node:18-bullseye-slim
WORKDIR /usr/src/app
ENV NODE_ENV=production
ENV PORT=3000

# Copy only production deps
COPY package*.json ./
RUN npm ci --only=production

# Copy built artifacts and server code
COPY --from=builder /usr/src/app .

EXPOSE 3000
CMD [ "node", "server/index.js" ]
