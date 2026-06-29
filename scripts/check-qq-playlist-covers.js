const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const index = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');

function assertIncludes(source, needle, description) {
  if (!source.includes(needle)) {
    throw new Error(`Missing ${description}: ${needle}`);
  }
}

function functionBody(source, name) {
  const marker = `function ${name}`;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing function: ${name}`);
  const braceStart = source.indexOf('{', start);
  if (braceStart < 0) throw new Error(`Missing function body: ${name}`);
  let depth = 0;
  for (let i = braceStart; i < source.length; i += 1) {
    const ch = source[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(braceStart, i + 1);
    }
  }
  throw new Error(`Unclosed function body: ${name}`);
}

function assertFunctionIncludes(source, functionName, needle, description) {
  const body = functionBody(source, functionName);
  if (!body.includes(needle)) {
    throw new Error(`Missing ${description} in ${functionName}: ${needle}`);
  }
}

assertIncludes(server, 'function normalizeQQImageUrl', 'QQ image URL normalizer');
assertIncludes(server, 'function qqPlaylistCoverSetFromTracks', 'QQ playlist coverSet helper');
assertIncludes(server, 'function enrichQQFavoritePlaylistCovers', 'QQ liked playlist cover enrichment');
assertFunctionIncludes(server, 'mapQQPlaylist', 'coverSet', 'coverSet returned by QQ playlist mapper');
assertFunctionIncludes(server, 'mapQQPlaylist', 'coverSource', 'coverSource returned by QQ playlist mapper');
assertFunctionIncludes(server, 'handleQQUserPlaylists', 'await enrichQQFavoritePlaylistCovers', 'QQ liked playlists enriched before response');
assertFunctionIncludes(server, 'handleQQPlaylistTracks', 'coverSet', 'QQ playlist detail returns coverSet');

assertIncludes(index, 'function playlistCoverSrc', 'front-end playlist cover fallback helper');
assertIncludes(index, 'function playlistCoverSet', 'front-end playlist cover set helper');
assertIncludes(index, 'playlistCoverSrc(pl', 'playlist UI uses cover fallback helper');
assertIncludes(index, 'coverSet', 'front-end handles playlist coverSet');

console.log('QQ playlist cover checks passed');
