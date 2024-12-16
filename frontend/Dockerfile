FROM node:18

WORKDIR /app

COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
RUN npm install

COPY ./src /app/src
COPY ./public /app/public

CMD ["npm", "start"]
