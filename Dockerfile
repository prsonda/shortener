FROM node:22-slim AS build

WORKDIR /app

RUN apt-get update -y && apt-get install -y libssl-dev openssl

COPY package*.json ./
RUN yarn install

COPY . .

RUN yarn prisma generate
RUN yarn build

FROM node:22-slim

WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl libssl3 && apt-get clean && rm -rf /var/lib/apt/lists/*

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/wait-for-it.sh /app/wait-for-it.sh
RUN chmod +x wait-for-it.sh

CMD ["sh", "-c", "./wait-for-it.sh db:5432 --timeout=30 && npx prisma migrate deploy && node dist/src/main.js"]
