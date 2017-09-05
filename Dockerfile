FROM node:latest

WORKDIR /corp-check

ADD package.json /corp-check/package.json
ADD src /corp-check/src

RUN npm install
RUN npm run build

CMD ["node", "."]