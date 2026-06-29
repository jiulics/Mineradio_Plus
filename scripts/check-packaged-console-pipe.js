const fs = require('fs');
const path = require('path');

const serverPath = path.join(__dirname, '..', 'server.js');
const source = fs.readFileSync(serverPath, 'utf8');

function assertIncludes(needle, description) {
  if (!source.includes(needle)) {
    throw new Error(`Missing ${description}: ${needle}`);
  }
}

assertIncludes('function ignoreBrokenConsolePipe', 'packaged console pipe guard');
assertIncludes("err.code === 'EPIPE'", 'EPIPE guard condition');
assertIncludes('ignoreBrokenConsolePipe(process.stdout)', 'stdout EPIPE guard');
assertIncludes('ignoreBrokenConsolePipe(process.stderr)', 'stderr EPIPE guard');

console.log('packaged console pipe checks passed');
