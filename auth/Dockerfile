<<<<<<< HEAD
FROM node

WORKDIR /app
COPY package.json .

RUN npm install

COPY . .

CMD ["npm", "run", "start:dev"]
=======
FROM node:14

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

CMD ["npm", "start"]
>>>>>>> ticket
