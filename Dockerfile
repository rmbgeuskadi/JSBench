FROM node:24-slim

ENV NODE_ENV=production
WORKDIR /app

# curl solo para el healthcheck
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Primero las dependencias (se cachean mientras no cambie package*.json)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts

COPY src ./src

# Nunca ejecutes la aplicación como root
USER node

EXPOSE 3000
HEALTHCHECK --interval=15s --timeout=3s --start-period=10s --retries=5 \
    CMD curl -fs http://localhost:3000/health | grep -q UP || exit 1

CMD ["node", "src/server.js"]