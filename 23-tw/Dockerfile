FROM node:15-alpine

WORKDIR /usr/src/app
COPY . /usr/src/app

RUN npm ci

USER node
CMD "npm" "start"
