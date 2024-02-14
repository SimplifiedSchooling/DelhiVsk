FROM node:alpine

RUN mkdir -p /usr/src/delhi-vsk && chown -R node:node /usr/src/delhi-vsk

WORKDIR /usr/src/delhi-vsk

COPY package.json ./

USER node

RUN npm install --pure-lockfile

COPY --chown=node:node . .

EXPOSE 5050
