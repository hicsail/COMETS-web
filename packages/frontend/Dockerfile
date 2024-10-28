FROM node:18-alpine as builder



ARG VITE_COMETS_BACKEND
ARG VITE_COMETS_FLASK

ENV VITE_COMETS_BACKEND ${VITE_COMETS_BACKEND}
ENV VITE_COMETS_FLASK ${VITE_COMETS_FLASK}

WORKDIR /usr/src/app
COPY . .

RUN npm install
RUN npm run build

FROM registry.access.redhat.com/ubi7/nginx-120

COPY --from=builder usr/src/app/dist .
ADD ./nginx.conf "${NGINX_CONF_PATH}"

CMD nginx -g 'daemon off;'
