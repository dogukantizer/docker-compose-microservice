FROM node:4

# Setup Environment Vars
# TODO from config file / service discovery DNS?
ENV MONGO_DB_CONN mongodb://mongo:27017/master
ENV REDIS_CONN redis://redis:6379
ENV JWT_AUTH_SECRET areallystrongsecretforauthenticationrequests

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
