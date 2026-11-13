FROM node:lts-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build NestJS application
RUN npm run build

EXPOSE 3002

# Start application
CMD ["npm", "run", "start:prod"]