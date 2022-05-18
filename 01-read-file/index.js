const fs = require('fs');
const path = require('path');
const readableStream = fs.createReadStream(path.resolve(__dirname,'text.txt'));
const {stdout, stderr, exit} = process;

readableStream.on('error', error => {
  stderr.write(error.message);
  exit();
});

readableStream.on('data', chunk => stdout.write(chunk));
