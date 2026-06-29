const fs = require('fs');
const path = require('path');
const vm = require('vm');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script(?=[\s>])[^>]*>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter((script) => script.trim());

scripts.forEach((script, index) => {
  new vm.Script(script, { filename: `public/index.html#script${index + 1}` });
});

console.log('inline scripts ok:', scripts.length);
