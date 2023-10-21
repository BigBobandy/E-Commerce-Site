FROM node:18

WORKDIR /app

COPY ./front-end/package*.json ./

RUN npm install

COPY front-end .

EXPOSE 8080

RUN npm run build

CMD [ "npm", "start" ]