FROM node:18-alpine

# Install OpenSSL 1.1 for Prisma
RUN apk add --no-cache openssl3

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

# If you want nodemon globally (optional)
RUN npm install -g nodemon

COPY . .

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "nodemon", "start"]