FROM node:buster

# Create app directory
WORKDIR /usr/ec-demo

RUN apt-get update
RUN apt-get install -y software-properties-common graphicsmagick
RUN npm i -g npm@5.6.0
