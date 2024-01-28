FROM node:16

WORKDIR /app

COPY . .

RUN npm install

RUN CI=false npm run build

EXPOSE 3010

CMD ["npm", "start"]