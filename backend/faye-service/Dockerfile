FROM node:4

# Setup Environment Vars
# TODO from config file / service discovery DNS?
ENV REDIS_HOST redis
ENV REDIS_PORT 6379

# ----------------------------------------------

# Create app directory
ADD ./src/package.json /tmp/package.json

# npm install
RUN cd /tmp && npm install

# copy over node modules
RUN mkdir -p /usr/src/app && cp -a /tmp/node_modules /usr/src/app/

WORKDIR /usr/src/app

# install forever
RUN npm install -g nodemon
RUN npm install -g forever

EXPOSE 8080

# Prod
#CMD forever app.js

# For Dev
CMD forever -c "nodemon --use-strict -L" app.js --exitcrash
