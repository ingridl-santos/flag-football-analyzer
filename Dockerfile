FROM node:24-alpine AS build-env

WORKDIR /app

COPY . ./

RUN npm install

RUN npm run build
RUN npm run storybook:build

FROM nginx:alpine
COPY --from=build-env /app/generate_environment.sh /generate_environment.sh
COPY --from=build-env /app/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-env /app/dist/app /usr/share/nginx/html/webapp
COPY --from=build-env /app/dist/storybook /usr/share/nginx/html/storybook

EXPOSE 80

ENTRYPOINT ["/generate_environment.sh", "PUBLIC_*", "/usr/share/nginx/html/webapp/admin/environment.js"]
CMD ["nginx", "-g", "daemon off;"]
