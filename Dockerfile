FROM node

COPY package.json /app/package.json
COPY public /app/public
COPY server.js /app/server.js
COPY data /app/data/
COPY .vscode /app/.vscode/

WORKDIR /app

RUN npm install

CMD ["node", "server.js"]