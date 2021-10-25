FROM node:lts as base
ENV NODE_ENV=development

WORKDIR /skippet-challenge

COPY package.json package.json
COPY package-lock.json package-lock.json

RUN npm ci
