FROM node:16

WORKDIR /app

COPY . .

RUN npm install
RUN yarn

RUN yarn build

EXPOSE 32001
CMD ["yarn", "start"]