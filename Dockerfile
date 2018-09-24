FROM ruby:2.5.1
RUN gem install bundler
RUN gem install foreman
COPY . /app
WORKDIR /app
EXPOSE 4567
RUN bundler
CMD ["foreman", "start", "-d", "/app", "-f", "/app/Procfile", "-p", "4567"]
