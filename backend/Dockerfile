FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

# npm is only needed to install deps — remove it from the final image.
# The runtime is just "node server.js"; this shrinks the attack surface
# (the npm bundled in the base image ships packages flagged by Trivy).
RUN npm cache clean --force && \
    rm -rf /usr/local/lib/node_modules/npm /usr/local/bin/npm /usr/local/bin/npx

COPY . .

EXPOSE 5000
CMD ["node", "server.js"]