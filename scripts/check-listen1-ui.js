const assert = require('assert');
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');
const readme = fs.readFileSync(path.join(__dirname, '..', 'README.md'), 'utf8');
const notice = fs.readFileSync(path.join(__dirname, '..', 'NOTICE.md'), 'utf8');

function mustContain(pattern, description) {
  assert(
    pattern.test(html),
    `Missing Listen1 UI integration: ${description}`
  );
}

mustContain(/<script\s+src=["']listen1-compat\.js["']><\/script>/, 'compat parser script tag');
mustContain(/LISTEN1_PLAYLIST_STORE_KEY/, 'localStorage key for imported playlists');
mustContain(/function\s+triggerListen1Import\s*\(/, 'import button handler');
mustContain(/function\s+handleListen1ImportFile\s*\(/, 'file input reader');
mustContain(/function\s+importListen1BackupText\s*\(/, 'backup JSON importer');
mustContain(/function\s+loadListen1PlaylistIntoQueue\s*\(/, 'queue loader for imported playlists');
mustContain(/provider\s*===\s*['"]listen1['"]/, 'playlist provider routing for Listen1');
mustContain(/searchPlayablePlatformSong\s*\(\s*song\s*,\s*\[\s*['"]netease['"]\s*,\s*['"]qq['"]\s*\]/, 'Listen1 playback matching through supported platforms');
mustContain(/songProviderKey\(song\)\s*===\s*['"]listen1['"]/, 'Listen1 source tagging and playback guard');
mustContain(/listen1-import-input/, 'hidden file input binding');

assert(/导入时会丢弃备份中的旧播放直链/.test(readme), 'README must state Listen1 direct URLs are discarded');
assert(/不会绕过限制/.test(readme), 'README must state platform restrictions are not bypassed');
assert(/MIT License/.test(notice) && /Listen1/.test(notice), 'NOTICE must acknowledge Listen1 MIT references');

console.log('listen1 UI integration checks passed');
