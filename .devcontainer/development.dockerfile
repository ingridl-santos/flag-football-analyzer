FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY ./package*.json ./
COPY ./.npmrc ./

RUN npm install

EXPOSE 8080
EXPOSE 6006
