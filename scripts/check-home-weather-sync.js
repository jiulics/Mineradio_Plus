const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '..', 'public', 'index.html');
const html = fs.readFileSync(indexPath, 'utf8');

function assertIncludes(needle, description) {
  if (!html.includes(needle)) {
    throw new Error(`Missing ${description}: ${needle}`);
  }
}

function assertNotIncludes(needle, description) {
  if (html.includes(needle)) {
    throw new Error(`Unexpected ${description}: ${needle}`);
  }
}

function functionBody(name) {
  const marker = `function ${name}`;
  const start = html.indexOf(marker);
  if (start < 0) throw new Error(`Missing function: ${name}`);
  const braceStart = html.indexOf('{', start);
  if (braceStart < 0) throw new Error(`Missing function body: ${name}`);
  let depth = 0;
  for (let i = braceStart; i < html.length; i += 1) {
    const ch = html[i];
    if (ch === '{') depth += 1;
    if (ch === '}') {
      depth -= 1;
      if (depth === 0) return html.slice(braceStart, i + 1);
    }
  }
  throw new Error(`Unclosed function body: ${name}`);
}

function assertFunctionIncludes(functionName, needle, description) {
  const body = functionBody(functionName);
  if (!body.includes(needle)) {
    throw new Error(`Missing ${description} in ${functionName}: ${needle}`);
  }
}

function assertFunctionNotIncludes(functionName, needle, description) {
  const body = functionBody(functionName);
  if (body.includes(needle)) {
    throw new Error(`Unexpected ${description} in ${functionName}: ${needle}`);
  }
}

assertNotIncludes('此处施工，敬请期待', 'old construction placeholder');
assertIncludes('id="home-local-time"', 'local time display');
assertIncludes('id="home-local-date"', 'local date display');
assertIncludes('id="home-weather-location"', 'weather location display');
assertIncludes('id="home-weather-summary"', 'weather summary display');
assertIncludes('function updateHomeWeatherClock', 'home weather clock updater');
assertIncludes('function renderHomeWeatherHero', 'home weather hero renderer');
assertNotIncludes('id="home-now-strip"', 'extra home current track strip that caused compact UI overflow');
assertNotIncludes('function renderHomeNowTrack', 'extra home current track renderer');
assertIncludes('playback-queue-side-active.empty-home-active .home-grid', 'home right cards yield only when the playback queue shelf is manually visible');
assertIncludes('function setPlaybackQueueSideActive', 'playback queue side body state helper');
assertNotIncludes('id="playback-side-queue"', 'fixed playback side queue DOM');
assertNotIncludes('#playback-side-queue', 'fixed playback side queue CSS');
assertIncludes('id="queue-visibility-btn"', 'top-right playback queue visibility toggle');
assertIncludes('var playbackQueueSideUserHidden', 'user-hidden playback queue state');
assertIncludes('function setPlaybackQueueSideUserHidden', 'playback queue visibility setter');
assertIncludes('function clearShelfForHomeSurface', 'Home cleanup for stale 3D playlist shelf state');
assertIncludes("clearShelfForHomeSurface('empty-home')", 'Home page clears stale 3D playlist shelf');
assertIncludes("clearShelfForHomeSurface('open-empty-home')", 'Home button clears stale 3D playlist shelf');
assertNotIncludes("shelfPresence: 'always'", 'default 3D playlist shelf presence');
assertIncludes('body.user-capsule-auto-hide #user-btn', 'account auto-hide only targets the account capsule');
assertNotIncludes('body.user-capsule-auto-hide #top-right{right:-96px', 'account auto-hide must not hide Home and queue buttons');
assertFunctionNotIncludes('goHome', 'dismissHomePage({ toast: true })', 'Home button closing Home instead of returning to Home');
assertNotIncludes('function renderPlaybackSideQueue', 'fixed playback side queue renderer');
assertNotIncludes('function syncPlaybackSideQueueCurrentTrack', 'fixed playback side queue current-track sync');
assertIncludes('function updatePlaybackShelfCompactFromPointer', '3D playback shelf hover compaction');
assertIncludes('playback-shelf-compact', '3D playback shelf compact body state');
assertNotIncludes('<div class="home-card-title" id="home-profile-title">', 'old oversized profile home card DOM');
assertNotIncludes('<div class="home-card-title" id="home-library-title">', 'old oversized extra song home card DOM');
assertIncludes('navigator.geolocation.getCurrentPosition', 'GPS-first weather location');
assertIncludes('东莞市松山湖', 'default Songshan Lake weather city');
assertIncludes('readHomeWeatherCity()', 'weather city localStorage migration');
assertIncludes('GPS 获取失败，请手动更新', 'GPS failure manual update prompt');
assertIncludes('function weatherRadioProviderPreference', 'weather radio provider preference helper');
assertIncludes("params.push('providers=' + encodeURIComponent(weatherRadioProviderPreference().join(',')))", 'weather radio sends provider preference');
assertIncludes('function trialBannerTextForPlayback', 'provider-aware trial banner text');

assertIncludes('function syncPlaybackRightSide', 'right-side playback sync hook');
assertIncludes('function showPlaybackQueueSide', 'right-side current queue display helper');
assertIncludes('focusCurrentTrack: function', '3D detail current-track focus API');
assertIncludes("syncPlaybackRightSide({ reason: 'content-open-sync'", '3D detail sync after content load');
assertIncludes("syncPlaybackRightSide({ reason: 'content-play-row' })", '3D detail row playback syncs without forcing the queue shelf open');
assertIncludes("syncPlaybackRightSide({ reason: 'play-queue-at'", 'playback sync call from playQueueAt');
assertNotIncludes("syncPlaybackRightSide({ reason: 'play-queue-at', forceQueue: true", 'playback must not force the right playlist shelf open');
assertIncludes("safeShelfCloseContent('playback-queue-sync')", 'closing 3D detail when playback queue shelf should show');
assertFunctionIncludes('showPlaybackQueueSide', "setPlaybackQueueSideActive(true)", 'playback queue sync enables the home playback layout');
assertFunctionIncludes('showPlaybackQueueSide', 'shelfManager.focusCurrentQueue(currentIdx)', 'playback queue sync centers current 3D shelf row');
assertFunctionIncludes('showPlaybackQueueSide', "setShelfMode('side')", 'playback queue sync uses the original side shelf');
assertFunctionIncludes('showPlaybackQueueSide', 'setShelfPinnedOpen(true, true)', 'playback queue sync keeps the original side shelf visible');
assertFunctionNotIncludes('showPlaybackQueueSide', 'opts.userInitiatedQueue && playbackQueueSideUserHidden', 'ordinary playback restoring the right playlist shelf');
assertFunctionIncludes('togglePlaybackQueueSideVisibility', 'var visible = playbackQueueSideActive && !playbackQueueSideUserHidden;', 'queue button uses visible state instead of toggling into hidden state');
assertFunctionIncludes('shouldAvoidStageLyricsForShelf', 'playbackQueueSideActive', 'stage lyrics avoid the pinned playback queue');
assertIncludes('layoutScale *= playbackQueueSideActive ? 0.60 : 0.72', 'playback queue lyric scale avoidance');
assertFunctionIncludes('placeCard', "var playbackShelfFrozen = modeIs === 'side' && playbackQueueSideActive;", 'playback queue shelf freezes pointer rotation');
assertFunctionIncludes('placeCard', "var compactShelf = playbackShelfFrozen && document.body.classList.contains('playback-shelf-compact');", 'playback queue shelf has compact left-hover state');
assertFunctionIncludes('currentItems', 'if (playbackQueueSideActive && !playbackQueueSideUserHidden && playQueue.length) return queueShelfItems();', 'playback queue shelf takes priority while playing');
assertIncludes('var homeShelfSuppressed = emptyHomeActive && !playbackQueueSideActive;', 'Home suppresses the 3D playlist shelf unless the queue is manually shown');
assertIncludes('} else if (homeShelfSuppressed) {', 'Home does not show the 3D playlist shelf by default');
assertFunctionIncludes('nextTrack', "playQueueAt(currentIdx, { preserveHomeState: keepHome })", 'next track keeps the home surface visible when already on home');
assertFunctionIncludes('prevTrack', "playQueueAt(currentIdx, { preserveHomeState: keepHome })", 'previous track keeps the home surface visible when already on home');
assertIncludes("playQueueAt(0, { preserveHomeState: true, userInitiatedQueue: true }).catch(function(e){ console.warn('[HomeDailyPlay]', e); });", 'home daily playback keeps the home surface visible and restores queue');
assertIncludes("playQueueAt(currentIdx, { preserveHomeState: true, userInitiatedQueue: true }).catch(function(e){ console.warn('[HomeSongPlay]', e); });", 'home song card playback keeps the home surface visible and restores queue');
assertIncludes('await playQueueAt(0, { context: activeRadioContext, preserveHomeState: true, userInitiatedQueue: true });', 'weather radio start keeps the home surface visible and restores queue');
assertIncludes('await playQueueAt(index, { context: activeRadioContext, preserveHomeState: true, userInitiatedQueue: true });', 'weather song playback keeps the home surface visible and restores queue');
assertNotIncludes('content-play-row-keep-detail', 'old behavior that kept playlist detail open during playback');

assertIncludes('function updateHomeWeatherAtmosphere', 'audio-reactive weather atmosphere updater');
assertIncludes('--weather-beat', 'weather atmosphere audio sync CSS variable');
assertIncludes('id="home-wave-track"', 'home audio waveform DOM');
assertIncludes('updateHomeAudioVisual(dt)', 'home waveform animation loop hook');

console.log('home weather and right-side sync checks passed');
