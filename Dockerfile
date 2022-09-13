FROM node:16.15-alpine3.14

RUN mkdir -p /opt/app

WORKDIR /opt/app

RUN adduser -S app

COPY src/ .

RUN npm install

RUN chown -R app /opt/app

USER app

EXPOSE 3000

CMD ["npm", "run", "start"]
