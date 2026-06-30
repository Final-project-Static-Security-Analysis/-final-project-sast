# Allon: Node.js 20 is quite outdated. I suggest using 26
# Allon: Also, it's a good security practice to lock down an exact version, e.g., node:26.4.0-alpine
FROM node:20-alpine

LABEL description="PyScanner — Python SAST Scanner"

WORKDIR /app

# Allon: If you aren't builing the app  in the container, why do you need package.json?
COPY package.json ./
COPY scanner.js ./scanner.js
COPY pyscanner.js ./pyscanner.js

ENTRYPOINT ["node", "/app/pyscanner.js"]
