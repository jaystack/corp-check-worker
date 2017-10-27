FROM node:latest

WORKDIR /corp-check

ADD package.json /corp-check/package.json
ADD package-lock.json /corp-check/package-lock.json

RUN npm install

ADD tsconfig.json /corp-check/tsconfig.json
ADD src /corp-check/src

RUN npm run build

CMD node . listen