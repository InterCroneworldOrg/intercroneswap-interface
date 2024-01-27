FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN CI=false npm run build

EXPOSE 3010

CMD ["npm", "start"]