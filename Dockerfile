# Minimal Dockerfile for Yahle backend
FROM node:18-bullseye-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Build step (if using tsc build) - optional
# RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000
CMD [ "node", "server/index.js" ]
