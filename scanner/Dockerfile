FROM node:20-alpine

LABEL maintainer="your-org"
LABEL description="PyScanner — Python SAST Scanner (CWE Top 25 2025)"

WORKDIR /app

# Copy scanner files
COPY package.json ./
COPY src/ ./src/
COPY github-action/entrypoint.js ./entrypoint.js

# No npm install needed — we use zero external dependencies

ENTRYPOINT ["node", "/app/entrypoint.js"]
