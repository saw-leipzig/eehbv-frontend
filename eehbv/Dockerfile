FROM nginx:alpine
WORKDIR /usr/share/nginx/html
COPY dist .
COPY default.conf /etc/nginx/conf.d/
RUN touch /var/run/nginx.pid && \
  chown -R nginx:nginx /var/run/nginx.pid
# USER nginx
EXPOSE 8080
HEALTHCHECK --interval=10s --timeout=3s CMD wget -O - \
  http://localhost:8080/ || exit 1

