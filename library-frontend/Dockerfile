FROM node:12-alpine

WORKDIR /app
COPY package-lock.json .
COPY package.json .
RUN npm i
COPY . .

CMD [ "npm", "start" ]
