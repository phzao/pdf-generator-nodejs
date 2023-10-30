FROM node:18-alpine AS base

WORKDIR /app

ENV NODE_PATH=./app

# Installs latest Chromium (89) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      harfbuzz \
      ca-certificates \
      ttf-freefont

# Tell Puppeteer to skip installing Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

ENV NODE_ENV=production


COPY . .

RUN npm ci

COPY . /

RUN apk add --no-cache tini

COPY package*.json /
EXPOSE 3000

#CMD ["node index.js"]
CMD ["sh", "-c", "node index.js"]

