const awsLambdaAdapter = require('aws-lambda-web-adapter');
const { createServer } = require('http');
const { default: next } = require('next');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });

const handle = app.getRequestHandler();

const server = createServer((req, res) => {
  handle(req, res);
});

exports.handler = awsLambdaAdapter(server, { binaryMimeTypes: ['application/octet-stream'] });
