
FROM node:alpine

WORKDIR /src

# set non secret configuration as ENV params
ENV LOGGER_LEVEL=debug
ENV PORT=3000
ENV APP_NAME=boilerplate-expertise

# Add package.json and npm install before app code to
ADD package.json .
RUN npm install

# Add the application code last
ADD . .

EXPOSE 3000
ENTRYPOINT ["npm","run", "start"]

