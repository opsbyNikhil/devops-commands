FROM node:24-alpine3.22 AS build
ADD . /myapp
WORKDIR /myapp
RUN npm install && npm run build

FROM nginx:1.29 AS runtimme
LABEL project=nodejs
LABEL author=Deployement_Team
COPY --from=build /myapp/build /usr/share/nginx/html
EXPOSE 80