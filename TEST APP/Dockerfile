FROM node:18-alpine

WORKDIR /app

# Copy everything first
COPY . .

# Install and build backend
WORKDIR /app/backend
RUN npm install --production

# Build frontend
WORKDIR /app/frontend
RUN npm install
RUN npm run build

# Back to app root
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

CMD ["node", "backend/server.js"]
