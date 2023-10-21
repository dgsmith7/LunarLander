# syntax=docker/dockerfile:1
   
FROM node:16.20.1-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init
ENV NODE_ENV production
WORKDIR /Revamp-2023
COPY --chown=node:node . .
RUN npm ci --only=production
USER node
CMD ["dumb-init", "node", "app.js"]
EXPOSE 8081