FROM node:18-alpine

WORKDIR /app

# Copy backend
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend ./backend

# Copy frontend
COPY frontend/package*.json ./frontend/
RUN cd frontend && npm install && npm run build

# Create startup script
RUN echo '#!/bin/sh\ncd /app/backend && npm start' > /entrypoint.sh && chmod +x /entrypoint.sh

EXPOSE 5000

CMD ["node", "backend/server.js"]
