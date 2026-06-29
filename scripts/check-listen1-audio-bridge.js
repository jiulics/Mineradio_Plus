const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const server = fs.readFileSync(path.join(root, 'server.js'), 'utf8');
const html = fs.readFileSync(path.join(root, 'public', 'index.html'), 'utf8');
const compat = fs.readFileSync(path.join(root, 'public', 'listen1-compat.js'), 'utf8');
const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');

function mustContain(source, pattern, description) {
  assert(pattern.test(source), `Missing Listen1 audio bridge: ${description}`);
}

mustContain(server, /LISTEN1_PROVIDER_CONFIG/, 'provider configuration');
mustContain(server, /handleListen1Search\s*\(/, 'server search handler');
mustContain(server, /handleListen1SongUrl\s*\(/, 'server song url handler');
mustContain(server, /handleListen1Resolve\s*\(/, 'server resolve handler');
mustContain(server, /handleListen1AuthImport\s*\(/, 'server auth import handler');
mustContain(server, /function\s+listen1CandidatePool\s*\(/, 'candidate fallback pool');
mustContain(server, /for\s*\(\s*const\s+matched\s+of\s+candidatesToTry\s*\)/, 'resolve tries multiple search candidates');
assert(!/\(songs\s*\|\|\s*\[\]\)\.forEach\s*\(\s*add\s*\)/.test(server), 'Listen1 resolver must not try unrelated search candidates');
mustContain(server, /pn\s*===\s*['"]\/api\/listen1\/search['"]/, 'search endpoint');
mustContain(server, /pn\s*===\s*['"]\/api\/listen1\/song\/url['"]/, 'song url endpoint');
mustContain(server, /pn\s*===\s*['"]\/api\/listen1\/resolve['"]/, 'resolve endpoint');
mustContain(server, /pn\s*===\s*['"]\/api\/listen1\/auth\/import['"]/, 'auth import endpoint');
mustContain(server, /kuwo/i, 'Kuwo source support');
mustContain(server, /kugou/i, 'Kugou source support');
mustContain(server, /migu/i, 'Migu source support');

mustContain(html, /resolveListen1Playback\s*\(/, 'frontend Listen1 resolver');
mustContain(html, /\/api\/listen1\/resolve/, 'frontend calls resolve endpoint');
mustContain(html, /\/api\/listen1\/song\/url/, 'frontend calls song url endpoint');
mustContain(html, /triggerListen1AuthImport\s*\(/, 'auth import button handler');
mustContain(html, /handleListen1AuthImportFile\s*\(/, 'auth import file handler');
mustContain(html, /listen1-auth-import-input/, 'auth import file input');
mustContain(html, /providerKey\s*===\s*['"]listen1['"][\s\S]{0,900}resolveListen1Playback/, 'Listen1 playback uses resolver before fallback');
mustContain(html, /playbackQualityWasDowngraded\s*\(\s*requestedQuality\s*,\s*data\.level\s*\)/, 'quality downgrade notice still checked for normal playback');
mustContain(html, /!isQQPlayback\s*&&\s*!isListen1Playback\s*&&\s*playbackQualityWasDowngraded\s*\(\s*requestedQuality\s*,\s*data\.level\s*\)/, 'Listen1 playback skips NetEase-only downgrade notice');

mustContain(compat, /kuwo:\s*true/, 'compat marks Kuwo as direct source');
mustContain(compat, /kugou:\s*true/, 'compat marks Kugou as direct source');
mustContain(compat, /migu:\s*true/, 'compat marks Migu as direct source');

assert(/Listen1[\s\S]{0,120}自动换源/.test(readme), 'README must mention Listen1 automatic source switching');
assert(/不绕过会员|不会绕过会员|不绕过版权|不会绕过版权/.test(readme), 'README must state membership/copyright restrictions are not bypassed');

console.log('listen1 audio bridge checks passed');
