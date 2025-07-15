FROM node:20

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma/schema.prisma ./prisma/schema.prisma
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev"]