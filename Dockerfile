FROM node:13.10.1-alpine@sha256:a8949c12dc72eda5eb54df7d57f03b719bd81af4d902eb5f0e334373f421a21d

COPY . .

RUN npm install
RUN node_modules/typescript/bin/tsc

ENTRYPOINT ["node", "/lib/main.js"]