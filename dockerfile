FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN yarn build
RUN yarn start

EXPOSE 32001
CMD ["yarn", "start"]