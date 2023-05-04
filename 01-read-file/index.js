const fs = require('node:fs');
const path = require('node:path');

const filePath = path.join(__dirname, 'text.txt');
const rs = fs.createReadStream(filePath,'utf-8');

rs.on('error', function (error) {
    process.stderr.write(`Oops! Something went wrong.\n${error}`);
    process.stderr.end();
});

rs.pipe(process.stdout);
