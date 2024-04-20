# Stage 1: Build the Angular application
FROM node:20.11.0 AS build
WORKDIR /usr/src/app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG CONFIGURATION=development
RUN npm run build -- --configuration $CONFIGURATION --output-path=./dist/out

# Argument for environment-specific configurations (nginx.dev.conf is default)

# Stage 2: Serve the application with Nginx
FROM nginx:alpine
ARG NGINX_CONF=nginx.dev.conf
## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*
## From 'build' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=build /usr/src/app/dist/out /usr/share/nginx/html
## Copy the default nginx.dev.conf provided by tiangolo/node-frontend
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf
