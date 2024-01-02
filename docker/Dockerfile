FROM node:20 AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

FROM build AS web
EXPOSE 8000

FROM build AS proxy
EXPOSE 8081
