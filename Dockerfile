FROM node:carbon

# Create app directory
WORKDIR /usr/ec-demo

RUN npm i -g npm@5.6.0
RUN apt-get update
