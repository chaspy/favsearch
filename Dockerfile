FROM ruby:3.3.0
ARG YOUR_CONSUMER_KEY
ARG YOUR_CONSUMER_SECRET
ENV YOUR_CONSUMER_KEY $YOUR_CONSUMER_KEY
ENV YOUR_CONSUMER_SECRET $YOUR_CONSUMER_SECRET
RUN gem install bundler
RUN gem install foreman
COPY . /app
WORKDIR /app
EXPOSE 4567
RUN bundler
CMD ["foreman", "start", "-d", "/app", "-f", "/app/Procfile", "-p", "4567"]
