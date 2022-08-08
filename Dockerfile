FROM node:16-alpine AS development

ENV NODE_ENV development

WORKDIR /app

RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD [ "npm" , "start"]