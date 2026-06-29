(function(root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.MineradioListen1Compat = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function() {
  var SUPPORTED_DIRECT_SOURCES = {
    netease: true,
    qq: true,
    kuwo: true,
    kugou: true,
    migu: true
  };

  function asString(value) {
    return value == null ? '' : String(value).trim();
  }

  function stripPrefix(value, prefixes) {
    value = asString(value);
    for (var i = 0; i < prefixes.length; i++) {
      if (value.indexOf(prefixes[i]) === 0) return value.slice(prefixes[i].length);
    }
    return value;
  }

  function inferSource(raw) {
    var source = asString(raw && raw.source).toLowerCase();
    var id = asString(raw && raw.id).toLowerCase();
    if (source) return source;
    if (id.indexOf('netrack_') === 0 || id.indexOf('ne') === 0) return 'netease';
    if (id.indexOf('qqtrack_') === 0 || id.indexOf('qq') === 0) return 'qq';
    if (id.indexOf('kgtrack_') === 0) return 'kugou';
    if (id.indexOf('kwtrack_') === 0) return 'kuwo';
    if (id.indexOf('mgtrack_') === 0) return 'migu';
    if (id.indexOf('bitrack_') === 0) return 'bilibili';
    if (id.indexOf('bitrack_v_') === 0) return 'bilibili';
    return 'listen1';
  }

  function normalizeListen1Track(raw, index) {
    raw = raw || {};
    var listen1Source = inferSource(raw);
    var rawId = asString(raw.id || raw.track_id || raw.mid || raw.songmid);
    var title = asString(raw.title || raw.name || raw.songname);
    var artist = asString(raw.artist || raw.singer || raw.author);
    var album = asString(raw.album || raw.albumname);
    var cover = asString(raw.img_url || raw.cover || raw.cover_img_url || raw.pic);
    var base = {
      name: title,
      artist: artist,
      artists: artist ? artist.split(/\s*\/\s*|\s*,\s*|\s*&\s*/).filter(Boolean).map(function(name) { return { name: name }; }) : [],
      album: album,
      cover: cover,
      duration: Number(raw.duration || raw.interval || 0) || 0,
      fee: Number(raw.fee || 0) || 0,
      listen1Source: listen1Source,
      listen1RawId: rawId,
      listen1SourceUrl: asString(raw.source_url),
      listen1Index: index || 0
    };

    if (listen1Source === 'netease') {
      var neId = rawId.indexOf('netrack_') === 0 ? rawId : ('netrack_' + stripPrefix(rawId, ['netrack_', 'ne']));
      return Object.assign({}, base, {
        provider: 'listen1',
        source: 'listen1',
        type: 'listen1',
        id: neId,
        listen1RawId: neId,
        playable: false,
        matchRequired: false,
      });
    }

    if (listen1Source === 'qq') {
      var qqId = rawId.indexOf('qqtrack_') === 0 ? rawId : ('qqtrack_' + stripPrefix(rawId, ['qqtrack_', 'qq']));
      var mid = stripPrefix(qqId, ['qqtrack_', 'qq']);
      return Object.assign({}, base, {
        provider: 'listen1',
        source: 'listen1',
        type: 'listen1',
        id: qqId,
        listen1RawId: qqId,
        mid: mid,
        songmid: mid,
        playable: false,
        matchRequired: false,
      });
    }

    if (listen1Source === 'kuwo') {
      var kwId = rawId.indexOf('kwtrack_') === 0 ? rawId : ('kwtrack_' + stripPrefix(rawId, ['kwtrack_', 'kw']));
      return Object.assign({}, base, {
        provider: 'listen1',
        source: 'listen1',
        type: 'listen1',
        id: kwId,
        listen1Source: 'kuwo',
        listen1RawId: kwId,
        playable: false,
        matchRequired: false
      });
    }

    if (listen1Source === 'kugou') {
      var kgId = rawId.indexOf('kgtrack_') === 0 ? rawId : ('kgtrack_' + stripPrefix(rawId, ['kgtrack_', 'kg']));
      return Object.assign({}, base, {
        provider: 'listen1',
        source: 'listen1',
        type: 'listen1',
        id: kgId,
        listen1Source: 'kugou',
        listen1RawId: kgId,
        playable: false,
        matchRequired: false
      });
    }

    if (listen1Source === 'migu') {
      var mgId = rawId.indexOf('mgtrack_') === 0 ? rawId : ('mgtrack_' + stripPrefix(rawId, ['mgtrack_', 'mg']));
      return Object.assign({}, base, {
        provider: 'listen1',
        source: 'listen1',
        type: 'listen1',
        id: mgId,
        listen1Source: 'migu',
        listen1RawId: mgId,
        contentId: asString(raw.content_id || raw.contentId),
        songId: asString(raw.song_id || raw.songId),
        quality: asString(raw.quality || raw.toneControl),
        playable: false,
        matchRequired: false
      });
    }

    return Object.assign({}, base, {
      provider: 'listen1',
      source: 'listen1',
      type: 'listen1',
      id: rawId || ('listen1-unresolved-' + (index || 0)),
      playable: false,
      matchRequired: true,
      unsupportedSource: !SUPPORTED_DIRECT_SOURCES[listen1Source],
    });
  }

  function normalizePlaylistObject(raw, fallbackId) {
    raw = raw || {};
    var info = raw.info || raw.playlist || {};
    var id = asString(info.id || raw.id || fallbackId || ('listen1_' + Date.now()));
    var tracks = Array.isArray(raw.tracks) ? raw.tracks : (Array.isArray(raw.songs) ? raw.songs : []);
    return {
      provider: 'listen1',
      source: 'listen1',
      type: 'playlist',
      id: 'listen1:' + id,
      listen1Id: id,
      name: asString(info.title || info.name || raw.title || raw.name || 'Listen1 歌单'),
      cover: asString(info.cover_img_url || info.cover || raw.cover || raw.cover_img_url),
      creator: 'Listen1',
      trackCount: tracks.length,
      importedAt: Date.now(),
      tracks: tracks.map(function(track, index) {
        return normalizeListen1Track(track, index);
      }).filter(function(track) {
        return !!(track.name || track.id);
      })
    };
  }

  function playlistIdsFromBackup(data) {
    if (Array.isArray(data.playerlists)) return data.playerlists.map(asString).filter(Boolean);
    if (Array.isArray(data.myplaylists)) return data.myplaylists.map(asString).filter(Boolean);
    return Object.keys(data).filter(function(key) {
      return /^myplaylist_/i.test(key) && data[key] && typeof data[key] === 'object';
    });
  }

  function parseListen1Backup(input) {
    var data = input;
    var warnings = [];
    if (typeof input === 'string') {
      try {
        data = JSON.parse(input);
      } catch (err) {
        return { ok: false, error: 'Invalid Listen1 JSON: ' + err.message, playlists: [], warnings: [] };
      }
    }
    if (!data || typeof data !== 'object') {
      return { ok: false, error: 'Invalid Listen1 backup object', playlists: [], warnings: [] };
    }

    var playlists = [];
    var ids = playlistIdsFromBackup(data);
    if (ids.length) {
      ids.forEach(function(id) {
        if (data[id] && typeof data[id] === 'object') playlists.push(normalizePlaylistObject(data[id], id));
        else warnings.push('Missing Listen1 playlist object: ' + id);
      });
    } else if (data.info || Array.isArray(data.tracks) || Array.isArray(data.songs)) {
      playlists.push(normalizePlaylistObject(data, data.info && data.info.id));
    } else if (Array.isArray(data.playlists)) {
      playlists = data.playlists.map(function(item, index) {
        return normalizePlaylistObject(item, item && (item.id || item.listen1Id) || ('playlist_' + index));
      });
    }

    playlists = playlists.filter(function(pl) { return pl && (pl.name || pl.tracks.length); });
    return {
      ok: playlists.length > 0,
      error: playlists.length ? '' : 'No Listen1 playlists found',
      playlists: playlists,
      trackCount: playlists.reduce(function(total, pl) { return total + (pl.tracks ? pl.tracks.length : 0); }, 0),
      warnings: warnings
    };
  }

  return {
    parseListen1Backup: parseListen1Backup,
    normalizeListen1Track: normalizeListen1Track,
    normalizePlaylistObject: normalizePlaylistObject
  };
});
