FROM node:24-alpine

WORKDIR /app

RUN apk add --no-cache git

COPY ./package*.json ./

RUN npm install --loglevel info