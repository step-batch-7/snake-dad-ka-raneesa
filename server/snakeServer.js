'use strict';

const { Server } = require('net');
const { readFileSync, existsSync } = require('fs');


const badRequestResponse = () => {
  let body =
    `<html>
  <head>
    <title>Socket Server</title>
  </head>
  <body>
    <p>404 File Not Found</p>
  </body>\r\n</html>`;
  return [
    'HTTP/1.1 404 File Not Found',
    'content-Type: text/html',
    `content-Length: ${body.length}`,
    'connection: closed',
    '',
    body
  ].join('\r\n');
};

const CONTENT_TYPES = {
  txt: 'text/plain',
  html: 'text/html',
  css: 'text/css',
  js: 'application/javaScript',
  json: 'application/json',
  jpg: 'image/jpg',
  jpeg: 'image/jpeg',
  png: 'image/png'
};

const getResponseHeaders = (resourceContent, type) => {
  return [
    'HTTP/1.1 200 OK',
    `content-Type: ${CONTENT_TYPES[type]}`,
    `content-Length: ${resourceContent.length}`,
    'connection: closed',
    '\r\n'
  ].join('\r\n');
};

const STATIC_FOLDER = `${__dirname}`

const readContent = requestUrl => {
  const filePath = `${STATIC_FOLDER}/..${requestUrl}`;
  if (existsSync(filePath)) return readFileSync(filePath);
  return null;
};

const handleRequests = text => {
  const [requestText] = text.split('\r\n');
  let [, requestUrl] = requestText.split(' ');
  if (requestUrl == '/') requestUrl = '/index.html';
  const [, type] = requestUrl.match(/.*\.(.*)$/) || [, 'txt'];
  let resourceContent = readContent(requestUrl);
  if (resourceContent == null) return [badRequestResponse()];
  const headers = getResponseHeaders(resourceContent, type);
  return [headers, resourceContent];
};

const handleConnection = function(socket) {
  const remote = `${socket.remoteAddress}:${socket.remotePort}`;
  console.warn('new connection', remote);
  socket.setEncoding('utf8');
  socket.on('error', err => console.error('socket error', err));
  socket.on('end', () => console.warn(`${remote} ended`));
  socket.on('close', () => console.warn(`${remote} closed`));
  socket.on('data', text => {
    console.warn(`${remote} data:\n${text}`)
    const response = handleRequests(text);
    response.forEach(r => socket.write(r));
  });
}

const main = function(port) {
  const server = new Server();
  server.on('listening', () => console.warn('Started listening at ', server.address()));
  server.on('error', err => console.warn('server error', err));
  server.on('close', () => console.warn('server closed'));
  server.on('connection', handleConnection);
  server.listen(port);
}

main(5000);