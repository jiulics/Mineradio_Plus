const assert = require('assert');
const path = require('path');

const compat = require(path.join(__dirname, '..', 'public', 'listen1-compat.js'));

const backup = {
  playerlists: ['myplaylist_a', 'myplaylist_b'],
  myplaylist_a: {
    info: {
      id: 'myplaylist_a',
      title: 'Listen1 Favorites',
      cover_img_url: 'https://example.test/cover.jpg',
      source_url: '',
    },
    tracks: [
      {
        id: 'netrack_12345',
        title: '雨天',
        artist: '房东的猫',
        album: '小城夏天',
        source: 'netease',
        img_url: 'https://example.test/ne.jpg',
        url: 'https://stale.example.test/audio.mp3',
      },
      {
        id: 'qqtrack_003abc',
        title: '晴天',
        artist: '周杰伦',
        album: '叶惠美',
        source: 'qq',
        img_url: 'https://example.test/qq.jpg',
      },
      {
        id: 'kgtrack_hash',
        title: '海阔天空',
        artist: 'Beyond',
        album: '',
        source: 'kugou',
        img_url: '',
      },
    ],
  },
  myplaylist_b: {
    info: { id: 'myplaylist_b', title: 'Empty' },
    tracks: [],
  },
};

const parsed = compat.parseListen1Backup(JSON.stringify(backup));
assert.strictEqual(parsed.ok, true);
assert.strictEqual(parsed.playlists.length, 2);
assert.strictEqual(parsed.trackCount, 3);
assert.deepStrictEqual(parsed.warnings, []);

const first = parsed.playlists[0];
assert.strictEqual(first.provider, 'listen1');
assert.strictEqual(first.source, 'listen1');
assert.strictEqual(first.name, 'Listen1 Favorites');
assert.strictEqual(first.id, 'listen1:myplaylist_a');
assert.strictEqual(first.tracks.length, 3);

const ne = first.tracks[0];
assert.strictEqual(ne.provider, 'netease');
assert.strictEqual(ne.source, 'netease');
assert.strictEqual(ne.id, '12345');
assert.strictEqual(ne.listen1Source, 'netease');
assert.strictEqual(ne.listen1RawId, 'netrack_12345');
assert.strictEqual(ne.url, undefined, 'stale Listen1 direct URL must be stripped');

const qq = first.tracks[1];
assert.strictEqual(qq.provider, 'qq');
assert.strictEqual(qq.source, 'qq');
assert.strictEqual(qq.mid, '003abc');
assert.strictEqual(qq.playable, false);

const kg = first.tracks[2];
assert.strictEqual(kg.provider, 'listen1');
assert.strictEqual(kg.source, 'listen1');
assert.strictEqual(kg.type, 'listen1');
assert.strictEqual(kg.playable, false);
assert.strictEqual(kg.matchRequired, true);
assert.strictEqual(kg.url, undefined, 'unsupported Listen1 tracks must not keep direct URLs');

const single = compat.parseListen1Backup(JSON.stringify(backup.myplaylist_a));
assert.strictEqual(single.ok, true);
assert.strictEqual(single.playlists.length, 1);
assert.strictEqual(single.playlists[0].name, 'Listen1 Favorites');

const invalid = compat.parseListen1Backup('not json');
assert.strictEqual(invalid.ok, false);
assert.match(invalid.error, /JSON/i);

console.log('listen1 compatibility checks passed');
