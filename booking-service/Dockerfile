
# Stage 1: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY prisma ./prisma
COPY prisma7.config.ts ./
COPY tsconfig.json tsconfig.build.json nest-cli.json ./
COPY src ./src

# Generate Prisma Client
RUN DATABASE_URL="postgresql://user:password@localhost:5432/booking_db" \
    ./node_modules/.bin/prisma generate --config prisma7.config.ts

# Build NestJS
RUN npm run build


# Stage 2: Production image
FROM node:22-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --ignore-scripts \
    && npm cache clean --force

# Copy generated Prisma Client and runtime files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist ./dist

USER node

EXPOSE 3002

CMD ["node", "dist/src/main.js"]
