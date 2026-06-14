FROM node:14.19.3-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm i

ADD . /usr/src/app

RUN npm run build

EXPOSE 3006

CMD ["npm", "start"]
